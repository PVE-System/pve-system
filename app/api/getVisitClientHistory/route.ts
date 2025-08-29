export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { visitRouteClients, visitRoutes } from '@/app/db/schema';
import { eq, and, desc, isNotNull } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId é obrigatório' },
        { status: 400 },
      );
    }

    // Buscar a última visita do cliente que tenha currentVisitDescription preenchida
    const lastVisit = await db
      .select({
        id: visitRouteClients.id,
        currentVisitDescription: visitRouteClients.currentVisitDescription,
        lastVisitDescription: visitRouteClients.lastVisitDescription,
        lastVisitConfirmedAt: visitRouteClients.lastVisitConfirmedAt,
        visitStatus: visitRouteClients.visitStatus,
        routeName: visitRoutes.routeName,
        scheduledDate: visitRoutes.scheduledDate,
        updatedAt: visitRouteClients.updatedAt,
      })
      .from(visitRouteClients)
      .leftJoin(visitRoutes, eq(visitRouteClients.visitRouteId, visitRoutes.id))
      .where(
        and(
          eq(visitRouteClients.clientId, parseInt(clientId)),
          // Buscar apenas visitas com status CONCLUIDO
          eq(visitRouteClients.visitStatus, 'CONCLUIDO'),
          // Buscar apenas visitas que tenham lastVisitConfirmedAt preenchida
          isNotNull(visitRouteClients.lastVisitConfirmedAt),
          // Buscar apenas visitas que tenham alguma descrição
          isNotNull(visitRouteClients.currentVisitDescription),
        ),
      )
      .orderBy(desc(visitRouteClients.lastVisitConfirmedAt))
      .limit(1);

    if (lastVisit.length === 0) {
      return NextResponse.json({
        hasHistory: false,
        lastVisitDescription: null,
        lastVisitConfirmedAt: null,
      });
    }

    const visit = lastVisit[0];

    return NextResponse.json({
      hasHistory: true,
      lastVisitDescription:
        visit.currentVisitDescription || visit.lastVisitDescription,
      lastVisitConfirmedAt: visit.lastVisitConfirmedAt,
      routeName: visit.routeName,
      scheduledDate: visit.scheduledDate,
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar histórico de visitas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
