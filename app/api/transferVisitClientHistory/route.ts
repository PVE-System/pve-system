export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { visitRouteClients } from '@/app/db/schema';
import { eq, and, isNotNull, inArray, desc } from 'drizzle-orm';

interface TransferHistoryRequest {
  clientId: number;
  newVisitRouteId: number;
}

export async function POST(request: NextRequest) {
  try {
    const { clientId, newVisitRouteId }: TransferHistoryRequest =
      await request.json();

    if (!clientId || !newVisitRouteId) {
      return NextResponse.json(
        { error: 'clientId e newVisitRouteId são obrigatórios' },
        { status: 400 },
      );
    }

    // Status que representam visitas já realizadas (não agendadas)
    const completedStatuses = ['CONCLUIDO', 'PENDENTE', 'DESINTERESSADO'];

    // Buscar a última visita do cliente que tenha currentVisitDescription preenchida
    const lastVisit = await db
      .select({
        id: visitRouteClients.id,
        currentVisitDescription: visitRouteClients.currentVisitDescription,
        lastVisitConfirmedAt: visitRouteClients.lastVisitConfirmedAt,
        updatedAt: visitRouteClients.updatedAt, // ← Adicionado
      })
      .from(visitRouteClients)
      .where(
        and(
          eq(visitRouteClients.clientId, clientId),
          isNotNull(visitRouteClients.currentVisitDescription),
          inArray(visitRouteClients.visitStatus, completedStatuses),
        ),
      )
      .orderBy(desc(visitRouteClients.updatedAt)) // ← Mudança aqui!
      .limit(1);

    if (lastVisit.length === 0) {
      return NextResponse.json({
        success: true,
        transferred: false,
        message: 'Cliente não possui histórico de visitas para transferir',
      });
    }

    const visit = lastVisit[0];

    // Atualizar a nova visita com o histórico da última visita
    await db
      .update(visitRouteClients)
      .set({
        lastVisitDescription: visit.currentVisitDescription,
        lastVisitConfirmedAt: visit.lastVisitConfirmedAt,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(visitRouteClients.clientId, clientId),
          eq(visitRouteClients.visitRouteId, newVisitRouteId),
        ),
      );

    return NextResponse.json({
      success: true,
      transferred: true,
      lastVisitDescription: visit.currentVisitDescription,
      lastVisitConfirmedAt: visit.lastVisitConfirmedAt,
      message: 'Histórico de visita transferido com sucesso',
    });
  } catch (error: unknown) {
    console.error('Erro ao transferir histórico de visitas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
