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

    // Buscar a última visita do cliente baseada em lastVisitConfirmedAt
    const lastVisit = await db
      .select({
        id: visitRouteClients.id,
        currentVisitDescription: visitRouteClients.currentVisitDescription,
        lastVisitDescription: visitRouteClients.lastVisitDescription,
        lastVisitConfirmedAt: visitRouteClients.lastVisitConfirmedAt,
        visitStatus: visitRouteClients.visitStatus,
        visitRouteId: visitRouteClients.visitRouteId,
        routeName: visitRoutes.routeName,
        scheduledDate: visitRoutes.scheduledDate,
        updatedAt: visitRouteClients.updatedAt,
      })
      .from(visitRouteClients)
      .leftJoin(visitRoutes, eq(visitRouteClients.visitRouteId, visitRoutes.id))
      .where(
        and(
          eq(visitRouteClients.clientId, parseInt(clientId)),
          // Considera a última confirmação de visita registrada no backend
          isNotNull(visitRouteClients.lastVisitConfirmedAt),
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
      visitRouteId: visit.visitRouteId,
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
