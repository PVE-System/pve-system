import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { visitRoutes } from '@/app/db/schema';
import { eq, and } from 'drizzle-orm';

interface UpdateRouteRequest {
  routeId: number;
  userId: number;
  routeStatus?: string;
  description?: string;
}

export async function PUT(request: NextRequest) {
  try {
    const { routeId, userId, routeStatus, description }: UpdateRouteRequest =
      await request.json();

    // Validações básicas
    if (!routeId) {
      return NextResponse.json(
        { error: 'routeId é obrigatório' },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 },
      );
    }

    // Verificar se a rota existe e pertence ao usuário
    const existingRoute = await db
      .select()
      .from(visitRoutes)
      .where(and(eq(visitRoutes.id, routeId), eq(visitRoutes.userId, userId)))
      .limit(1);

    if (existingRoute.length === 0) {
      return NextResponse.json(
        { error: 'Rota não encontrada ou não pertence ao usuário' },
        { status: 404 },
      );
    }

    // Preparar dados para atualização
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (routeStatus !== undefined) {
      updateData.routeStatus = routeStatus;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    // Atualizar a rota
    const updatedRoute = await db
      .update(visitRoutes)
      .set(updateData)
      .where(and(eq(visitRoutes.id, routeId), eq(visitRoutes.userId, userId)))
      .returning();

    return NextResponse.json({
      success: true,
      route: updatedRoute[0],
      message: 'Rota atualizada com sucesso',
    });
  } catch (error: unknown) {
    console.error('Erro ao atualizar rota:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
