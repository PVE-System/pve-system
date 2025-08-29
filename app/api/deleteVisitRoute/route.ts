import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { visitRoutes, visitRouteClients } from '@/app/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const routeId = searchParams.get('routeId');

    if (!routeId) {
      return NextResponse.json(
        { error: 'routeId é obrigatório' },
        { status: 400 },
      );
    }

    // Verificar se a rota existe
    const existingRoute = await db
      .select()
      .from(visitRoutes)
      .where(eq(visitRoutes.id, parseInt(routeId)))
      .limit(1);

    if (existingRoute.length === 0) {
      return NextResponse.json(
        { error: 'Rota não encontrada' },
        { status: 404 },
      );
    }

    // Deletar primeiro os clientes da rota
    await db
      .delete(visitRouteClients)
      .where(eq(visitRouteClients.visitRouteId, parseInt(routeId)));

    // Deletar a rota
    await db.delete(visitRoutes).where(eq(visitRoutes.id, parseInt(routeId)));

    return NextResponse.json({
      message: 'Rota deletada com sucesso',
      deletedRouteId: parseInt(routeId),
    });
  } catch (error: unknown) {
    console.error('Erro ao deletar rota de visita:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
