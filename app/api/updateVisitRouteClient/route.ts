import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { visitRouteClients, visitRoutes } from '@/app/db/schema';
import { eq, and } from 'drizzle-orm';

interface UpdateVisitRequest {
  visitId: number;
  visitStatus?: string;
  currentVisitDescription?: string;
  lastVisitDescription?: string;
}

export async function PUT(request: NextRequest) {
  try {
    const {
      visitId,
      visitStatus,
      currentVisitDescription,
      lastVisitDescription,
    }: UpdateVisitRequest = await request.json();

    // Validações básicas
    if (!visitId) {
      return NextResponse.json(
        { error: 'visitId é obrigatório' },
        { status: 400 },
      );
    }

    // Verificar se a visita existe
    const existingVisit = await db
      .select()
      .from(visitRouteClients)
      .where(eq(visitRouteClients.id, visitId))
      .limit(1);

    if (existingVisit.length === 0) {
      return NextResponse.json(
        { error: 'Visita não encontrada' },
        { status: 404 },
      );
    }

    // Preparar dados para atualização
    const updateData: any = {
      // updatedAt: new Date(), // Comentado para preservar ordem dos clientes
    };

    if (visitStatus !== undefined) {
      updateData.visitStatus = visitStatus;
    }

    if (currentVisitDescription !== undefined) {
      updateData.currentVisitDescription = currentVisitDescription;
    }

    if (lastVisitDescription !== undefined) {
      updateData.lastVisitDescription = lastVisitDescription;
    }

    // Lógica para lastVisitConfirmedAt
    if (visitStatus !== undefined) {
      if (visitStatus === 'CONCLUIDO') {
        // Se o status for CONCLUIDO, atualizar lastVisitConfirmedAt
        updateData.lastVisitConfirmedAt = new Date();
      } else {
        // Se o status for qualquer outro valor, limpar lastVisitConfirmedAt
        updateData.lastVisitConfirmedAt = null;
      }
    }

    // Atualizar a visita
    const updatedVisit = await db
      .update(visitRouteClients)
      .set(updateData)
      .where(eq(visitRouteClients.id, visitId))
      .returning();

    // Buscar o routeId da visita atualizada
    const visitWithRoute = await db
      .select({
        visitRouteId: visitRouteClients.visitRouteId,
      })
      .from(visitRouteClients)
      .where(eq(visitRouteClients.id, visitId))
      .limit(1);

    return NextResponse.json({
      success: true,
      visit: updatedVisit[0],
      routeId: visitWithRoute[0]?.visitRouteId,
      message: 'Visita atualizada com sucesso',
    });
  } catch (error: unknown) {
    console.error('Erro ao atualizar visita:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
