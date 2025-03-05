import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/app/db';
import { businessGroups } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

// Captura o ID nos parâmetros da URL
export async function PUT(
  request: NextRequest,
  { params }: { params: { groupId: string } },
) {
  try {
    const { groupId } = params; // Pega o ID da URL
    const groupToUpdate = await request.json(); // Pega o body enviado pelo frontend

    const id = Number(groupId); // Converte para número
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    // Verifica se o grupo existe
    const existingGroup = await db
      .select()
      .from(businessGroups)
      .where(eq(businessGroups.id, id))
      .limit(1);

    if (existingGroup.length === 0) {
      return NextResponse.json(
        { error: 'Business Group not found' },
        { status: 404 },
      );
    }

    // Atualiza o grupo empresarial
    const updatedGroup = await db
      .update(businessGroups)
      .set({ name: groupToUpdate.name })
      .where(eq(businessGroups.id, id))
      .returning({
        id: businessGroups.id,
        name: businessGroups.name,
        createdAt: businessGroups.createdAt,
      })
      .execute();

    return NextResponse.json({ businessGroup: updatedGroup });
  } catch (error: unknown) {
    console.error('Erro ao atualizar grupo:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 },
    );
  }
}
