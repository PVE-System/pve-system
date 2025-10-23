export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { clients, businessGroups } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');

    if (!groupId) {
      return NextResponse.json(
        { error: 'ID do grupo empresarial é obrigatório' },
        { status: 400 },
      );
    }

    // Buscar o grupo empresarial primeiro para verificar se existe
    const businessGroup = await db
      .select()
      .from(businessGroups)
      .where(eq(businessGroups.id, parseInt(groupId)))
      .limit(1);

    if (businessGroup.length === 0) {
      return NextResponse.json(
        { error: 'Grupo empresarial não encontrado' },
        { status: 404 },
      );
    }

    // Buscar todos os clientes que pertencem ao grupo empresarial
    const clientsInGroup = await db
      .select({
        id: clients.id,
        companyName: clients.companyName,
        corfioCode: clients.corfioCode,
        clientCondition: clients.clientCondition,
        rating: clients.rating,
        state: clients.state,
        city: clients.city,
        businessGroupId: clients.businessGroupId,
      })
      .from(clients)
      .where(eq(clients.businessGroupId, parseInt(groupId)));

    return NextResponse.json({
      businessGroup: businessGroup[0],
      clients: clientsInGroup,
    });
  } catch (error) {
    console.error('Erro ao buscar clientes do grupo empresarial:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
