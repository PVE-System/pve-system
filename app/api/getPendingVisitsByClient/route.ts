export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { visitRouteClients, visitRoutes, clients } from '@/app/db/schema';
import { eq, and, desc, inArray, isNotNull, gt } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || 'PENDENTE'; // Padrão é PENDENTE

    // Validar o filtro de status
    if (!['PENDENTE', 'DESINTERESSADO'].includes(statusFilter)) {
      return NextResponse.json(
        { error: 'Status inválido. Use PENDENTE ou DESINTERESSADO' },
        { status: 400 },
      );
    }
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

            // Buscar a visita com status filtrado mais recente deste cliente
            latestVisit = await db
              .select({
                id: visitRouteClients.id,
                visitRouteId: visitRouteClients.visitRouteId,
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
                  eq(visitRouteClients.visitStatus, statusFilter),
                ),
              )
              .orderBy(desc(visitRouteClients.updatedAt))
              .limit(1);
          }
        } else if (client.customerNameUnregistered) {
          // Cliente não cadastrado
          clientName = client.customerNameUnregistered;
          isRegisteredClient = false;

          // Buscar a visita com status filtrado mais recente deste cliente não cadastrado
          latestVisit = await db
            .select({
              id: visitRouteClients.id,
              visitRouteId: visitRouteClients.visitRouteId,
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
                eq(visitRouteClients.visitStatus, statusFilter),
              ),
            )
            .orderBy(desc(visitRouteClients.updatedAt))
            .limit(1);
        }

        // 3. Se encontrou uma visita com status filtrado, verificar se não há visitas finalizadas mais recentes
        if (latestVisit && latestVisit.length > 0) {
          // Buscar se existe alguma visita finalizada mais recente que a visita com status filtrado
          const finalizingStatuses = ['CONCLUIDO'];

          // Para ambos os status (PENDENTE e DESINTERESSADO), precisamos verificar se há visitas CONCLUIDO mais recentes
          // que substituiriam o status atual na lista

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
                  // Só considerar visitas mais recentes que a visita com status filtrado
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
                  // Só considerar visitas mais recentes que a visita com status filtrado
                  gt(visitRouteClients.updatedAt, latestVisit[0].updatedAt),
                ),
              )
              .orderBy(desc(visitRouteClients.updatedAt))
              .limit(1);

            hasMoreRecentFinalizedVisit = finalizedVisit.length > 0;
          }

          // Só retornar se NÃO há visitas finalizadas mais recentes (para ambos os status)
          if (!hasMoreRecentFinalizedVisit) {
            return {
              id: latestVisit[0].id,
              visitRouteId: latestVisit[0].visitRouteId,
              clientName,
              visitStatus: latestVisit[0].visitStatus,
              routeName: latestVisit[0].routeName,
              scheduledDate: latestVisit[0].scheduledDate,
              isRegisteredClient,
            };
          }
        }

        return null; // Cliente não tem visita com o status filtrado
      }),
    );

    // 4. Filtrar apenas os clientes com visitas do status filtrado
    const filteredVisits = pendingVisitsByClient.filter(
      (visit) => visit !== null,
    );

    return NextResponse.json({
      success: true,
      pendingVisits: filteredVisits,
      total: filteredVisits.length,
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
