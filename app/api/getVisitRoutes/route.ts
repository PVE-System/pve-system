import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import {
  visitRoutes,
  visitRouteClients,
  clients,
  users,
} from '@/app/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 },
      );
    }

    // Buscar rotas do usuário com filtros
    const whereConditions = [eq(visitRoutes.userId, parseInt(userId))];

    if (year) {
      if (month) {
        // Filtro por mês específico
        const startDate = new Date(
          parseInt(year),
          parseInt(month) - 1, // Mês começa em 0
          1, // Primeiro dia do mês
          0,
          0,
          0,
          0,
        );

        // Último dia do mês
        const lastDayOfMonth = new Date(
          parseInt(year),
          parseInt(month), // Próximo mês
          0, // Dia 0 = último dia do mês anterior
        );

        const endDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          lastDayOfMonth.getDate(),
          23,
          59,
          59,
          999,
        );

        console.log(
          `Filtro mês ${month}: ${startDate.toISOString()} até ${endDate.toISOString()}`,
        );
        whereConditions.push(gte(visitRoutes.scheduledDate, startDate));
        whereConditions.push(lte(visitRoutes.scheduledDate, endDate));
      } else {
        // Filtro apenas por ano
        const startDate = new Date(
          parseInt(year),
          0, // Janeiro
          1, // Primeiro dia
          0,
          0,
          0,
          0,
        );

        const endDate = new Date(
          parseInt(year),
          11, // Dezembro
          31, // Último dia
          23,
          59,
          59,
          999,
        );

        whereConditions.push(gte(visitRoutes.scheduledDate, startDate));
        whereConditions.push(lte(visitRoutes.scheduledDate, endDate));
      }
    }

    // Buscar rotas do usuário com filtros
    const allUserRoutes = await db
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
      .where(and(...whereConditions))
      .orderBy(visitRoutes.scheduledDate);

    // As rotas já estão filtradas pela consulta SQL
    const userRoutes = allUserRoutes;

    // Para cada rota, buscar os clientes associados
    const routesWithClients = await Promise.all(
      userRoutes.map(async (route) => {
        const routeClients = await db
          .select({
            id: visitRouteClients.id,
            clientId: visitRouteClients.clientId,
            customerNameUnregistered:
              visitRouteClients.customerNameUnregistered,
            customerStateUnregistered:
              visitRouteClients.customerStateUnregistered,
            customerCityUnregistered:
              visitRouteClients.customerCityUnregistered,
            visitStatus: visitRouteClients.visitStatus,
            currentVisitDescription: visitRouteClients.currentVisitDescription,
            lastVisitDescription: visitRouteClients.lastVisitDescription,
            lastVisitConfirmedAt: visitRouteClients.lastVisitConfirmedAt,
          })
          .from(visitRouteClients)
          .where(eq(visitRouteClients.visitRouteId, route.id));

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

        return {
          ...route,
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
        };
      }),
    );

    // Buscar anos disponíveis para filtro
    const currentYear = new Date().getFullYear();

    // Por enquanto, vamos usar uma lista fixa de anos começando do atual
    // Em uma implementação futura, podemos buscar dinamicamente do banco
    const years = [currentYear, currentYear + 1, currentYear + 2];

    return NextResponse.json({
      routes: routesWithClients,
      availableYears: years,
      filters: {
        year: year ? parseInt(year) : null,
        month: month ? parseInt(month) : null,
      },
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar rotas de visita:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
