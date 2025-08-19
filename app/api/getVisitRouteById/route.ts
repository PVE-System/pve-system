export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import {
  visitRoutes,
  visitRouteClients,
  clients,
  users,
} from '@/app/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const routeId = searchParams.get('routeId');

    if (!routeId) {
      return NextResponse.json(
        { error: 'routeId é obrigatório' },
        { status: 400 },
      );
    }

    // Buscar a rota específica
    const route = await db
      .select({
        id: visitRoutes.id,
        userId: visitRoutes.userId,
        routeName: visitRoutes.routeName,
        scheduledDate: visitRoutes.scheduledDate,
        routeStatus: visitRoutes.routeStatus,
        description: visitRoutes.description,
        createdAt: visitRoutes.createdAt,
        updatedAt: visitRoutes.updatedAt,
        userName: users.name,
      })
      .from(visitRoutes)
      .leftJoin(users, eq(visitRoutes.userId, users.id))
      .where(eq(visitRoutes.id, parseInt(routeId)))
      .limit(1);

    if (route.length === 0) {
      return NextResponse.json(
        { error: 'Rota não encontrada' },
        { status: 404 },
      );
    }

    const routeData = route[0];

    // Buscar os clientes associados à rota
    const routeClients = await db
      .select({
        id: visitRouteClients.id,
        clientId: visitRouteClients.clientId,
        customerNameUnregistered: visitRouteClients.customerNameUnregistered,
        customerStateUnregistered: visitRouteClients.customerStateUnregistered,
        customerCityUnregistered: visitRouteClients.customerCityUnregistered,
        visitStatus: visitRouteClients.visitStatus,
        currentVisitDescription: visitRouteClients.currentVisitDescription,
        lastVisitDescription: visitRouteClients.lastVisitDescription,
        lastVisitConfirmedAt: visitRouteClients.lastVisitConfirmedAt,
      })
      .from(visitRouteClients)
      .where(eq(visitRouteClients.visitRouteId, parseInt(routeId)));

    // Para clientes cadastrados, buscar informações adicionais
    const clientsWithDetails = await Promise.all(
      routeClients.map(async (routeClient) => {
        if (routeClient.clientId) {
          const clientDetails = await db
            .select({
              id: clients.id,
              companyName: clients.companyName,
              state: clients.state,
              city: clients.city,
            })
            .from(clients)
            .where(eq(clients.id, routeClient.clientId))
            .limit(1);

          return {
            ...routeClient,
            clientDetails: clientDetails[0] || null,
          };
        }

        return {
          ...routeClient,
          clientDetails: null,
        };
      }),
    );

    // Função para converter timestamp UTC para data local formatada
    const convertUTCToLocalDateString = (utcDate: Date | string | null) => {
      if (!utcDate) return null;
      try {
        const date = new Date(utcDate);
        if (isNaN(date.getTime())) return null;

        // Formatar diretamente como string no formato brasileiro
        // Usando toLocaleDateString com timezone específico para garantir consistência
        return date.toLocaleDateString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      } catch {
        return null;
      }
    };

    const routeWithClients = {
      ...routeData,
      // Converter scheduledDate para data local formatada
      scheduledDate: convertUTCToLocalDateString(routeData.scheduledDate),
      clients: clientsWithDetails,
      totalClients: clientsWithDetails.length,
      completedVisits: clientsWithDetails.filter(
        (client) => client.visitStatus === 'CONCLUIDO',
      ).length,
      pendingVisits: clientsWithDetails.filter(
        (client) => client.visitStatus === 'PENDENTE',
      ).length,
      scheduledVisits: clientsWithDetails.filter(
        (client) => client.visitStatus === 'AGENDADO',
      ).length,
      disinterestedVisits: clientsWithDetails.filter(
        (client) => client.visitStatus === 'DESINTERESSADO',
      ).length,
    };

    return NextResponse.json({
      route: routeWithClients,
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar rota por ID:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
