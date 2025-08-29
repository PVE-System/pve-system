export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import {
  visitRoutes,
  visitRouteClients,
  clients,
  users,
} from '@/app/db/schema';
import { eq, and, asc } from 'drizzle-orm';

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

    // Debug do fuso horário do servidor
    console.log(
      '🔍 DEBUG - Fuso horário do servidor:',
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    console.log('🔍 DEBUG - Data atual do servidor:', new Date().toString());
    console.log('🔍 DEBUG - Data atual UTC:', new Date().toISOString());

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
      .where(eq(visitRouteClients.visitRouteId, parseInt(routeId)))
      .orderBy(asc(visitRouteClients.id)); // Ordenar por ID (ordem de inserção)

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

    // Função para formatar data escolhida pelo usuário
    const formatUserSelectedDate = (utcDate: Date | string | null) => {
      if (!utcDate) return null;
      try {
        console.log('🔍 DEBUG - Data original do banco:', utcDate);
        console.log('🔍 DEBUG - Tipo da data:', typeof utcDate);

        const date = new Date(utcDate);
        console.log('🔍 DEBUG - Date object criado:', date);

        if (isNaN(date.getTime())) return null;

        // Para data escolhida pelo usuário, extrair apenas dia/mês/ano
        // e formatar como DD/MM/AAAA
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear().toString();

        const result = `${day}/${month}/${year}`;
        console.log('🔍 DEBUG - Resultado final:', result);

        return result;
      } catch (error) {
        console.error('🔍 DEBUG - Erro na conversão:', error);
        return null;
      }
    };

    const routeWithClients = {
      ...routeData,
      // Formatar data escolhida pelo usuário
      scheduledDate: formatUserSelectedDate(routeData.scheduledDate),
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
