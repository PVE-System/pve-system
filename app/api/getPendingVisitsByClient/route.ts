export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { visitRouteClients, visitRoutes, clients } from '@/app/db/schema';
import { eq, and, desc, inArray, isNotNull, gt } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // 1. Primeiro, buscar todos os clientes únicos que têm visitas
    const allClientsWithVisits = await db
      .select({
        clientId: visitRouteClients.clientId,
        customerNameUnregistered: visitRouteClients.customerNameUnregistered,
      })
      .from(visitRouteClients)
      .groupBy(
        visitRouteClients.clientId,
        visitRouteClients.customerNameUnregistered,
      );

    // 2. Para cada cliente, buscar sua visita mais recente
    const pendingVisitsByClient = await Promise.all(
      allClientsWithVisits.map(async (client) => {
        let clientName = '';
        let isRegisteredClient = false;
        let latestVisit = null;

        if (client.clientId) {
          // Cliente cadastrado
          const clientInfo = await db
            .select({
              companyName: clients.companyName,
            })
            .from(clients)
            .where(eq(clients.id, client.clientId))
            .limit(1);

          if (clientInfo.length > 0) {
            clientName = clientInfo[0].companyName;
            isRegisteredClient = true;

            // Buscar a visita PENDENTE mais recente deste cliente
            latestVisit = await db
              .select({
                id: visitRouteClients.id,
                visitStatus: visitRouteClients.visitStatus,
                routeName: visitRoutes.routeName,
                scheduledDate: visitRoutes.scheduledDate,
                updatedAt: visitRouteClients.updatedAt,
              })
              .from(visitRouteClients)
              .leftJoin(
                visitRoutes,
                eq(visitRouteClients.visitRouteId, visitRoutes.id),
              )
              .where(
                and(
                  eq(visitRouteClients.clientId, client.clientId),
                  eq(visitRouteClients.visitStatus, 'PENDENTE'),
                ),
              )
              .orderBy(desc(visitRouteClients.updatedAt))
              .limit(1);
          }
        } else if (client.customerNameUnregistered) {
          // Cliente não cadastrado
          clientName = client.customerNameUnregistered;
          isRegisteredClient = false;

          // Buscar a visita PENDENTE mais recente deste cliente não cadastrado
          latestVisit = await db
            .select({
              id: visitRouteClients.id,
              visitStatus: visitRouteClients.visitStatus,
              routeName: visitRoutes.routeName,
              scheduledDate: visitRoutes.scheduledDate,
              updatedAt: visitRouteClients.updatedAt,
            })
            .from(visitRouteClients)
            .leftJoin(
              visitRoutes,
              eq(visitRouteClients.visitRouteId, visitRoutes.id),
            )
            .where(
              and(
                eq(
                  visitRouteClients.customerNameUnregistered,
                  client.customerNameUnregistered,
                ),
                eq(visitRouteClients.visitStatus, 'PENDENTE'),
              ),
            )
            .orderBy(desc(visitRouteClients.updatedAt))
            .limit(1);
        }

        // 3. Se encontrou uma visita PENDENTE, verificar se não há visitas finalizadas mais recentes
        if (latestVisit && latestVisit.length > 0) {
          // Buscar se existe alguma visita finalizada mais recente que a visita PENDENTE
          const finalizingStatuses = ['CONCLUIDO', 'DESINTERESSADO'];

          let hasMoreRecentFinalizedVisit = false;

          if (client.clientId) {
            // Para cliente cadastrado
            const finalizedVisit = await db
              .select({
                id: visitRouteClients.id,
                updatedAt: visitRouteClients.updatedAt,
              })
              .from(visitRouteClients)
              .where(
                and(
                  eq(visitRouteClients.clientId, client.clientId),
                  inArray(visitRouteClients.visitStatus, finalizingStatuses),
                  // Só considerar visitas mais recentes que a visita PENDENTE
                  gt(visitRouteClients.updatedAt, latestVisit[0].updatedAt),
                ),
              )
              .orderBy(desc(visitRouteClients.updatedAt))
              .limit(1);

            hasMoreRecentFinalizedVisit = finalizedVisit.length > 0;
          } else if (client.customerNameUnregistered) {
            // Para cliente não cadastrado
            const finalizedVisit = await db
              .select({
                id: visitRouteClients.id,
                updatedAt: visitRouteClients.updatedAt,
              })
              .from(visitRouteClients)
              .where(
                and(
                  eq(
                    visitRouteClients.customerNameUnregistered,
                    client.customerNameUnregistered,
                  ),
                  inArray(visitRouteClients.visitStatus, finalizingStatuses),
                  // Só considerar visitas mais recentes que a visita PENDENTE
                  gt(visitRouteClients.updatedAt, latestVisit[0].updatedAt),
                ),
              )
              .orderBy(desc(visitRouteClients.updatedAt))
              .limit(1);

            hasMoreRecentFinalizedVisit = finalizedVisit.length > 0;
          }

          // Só retornar se NÃO há visitas finalizadas mais recentes
          if (!hasMoreRecentFinalizedVisit) {
            return {
              id: latestVisit[0].id,
              clientName,
              visitStatus: latestVisit[0].visitStatus,
              routeName: latestVisit[0].routeName,
              scheduledDate: latestVisit[0].scheduledDate,
              isRegisteredClient,
            };
          }
        }

        return null; // Cliente não tem visita pendente
      }),
    );

    // 4. Filtrar apenas os clientes com visitas pendentes
    const pendingVisits = pendingVisitsByClient.filter(
      (visit) => visit !== null,
    );

    return NextResponse.json({
      success: true,
      pendingVisits,
      total: pendingVisits.length,
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar visitas pendentes por cliente:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
