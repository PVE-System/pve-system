export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { visitRouteClients, clients, visitRoutes } from '@/app/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitId = searchParams.get('visitId');

    if (!visitId) {
      return NextResponse.json(
        { error: 'visitId é obrigatório' },
        { status: 400 },
      );
    }

    // Buscar a visita específica e verificar se pertence ao usuário
    const visit = await db
      .select({
        id: visitRouteClients.id,
        visitRouteId: visitRouteClients.visitRouteId,
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
      .leftJoin(visitRoutes, eq(visitRouteClients.visitRouteId, visitRoutes.id))
      .where(eq(visitRouteClients.id, parseInt(visitId)))
      .limit(1);

    if (visit.length === 0) {
      return NextResponse.json(
        { error: 'Visita não encontrada ou não pertence ao usuário' },
        { status: 404 },
      );
    }

    const visitData = visit[0];

    // Se o cliente for cadastrado, buscar informações adicionais
    let clientDetails = null;
    if (visitData.clientId) {
      const clientInfo = await db
        .select({
          id: clients.id,
          companyName: clients.companyName,
          state: clients.state,
          city: clients.city,
        })
        .from(clients)
        .where(eq(clients.id, visitData.clientId))
        .limit(1);

      clientDetails = clientInfo[0] || null;
    }

    const visitWithDetails = {
      ...visitData,
      clientDetails,
    };

    return NextResponse.json({
      visit: visitWithDetails,
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar visita:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
