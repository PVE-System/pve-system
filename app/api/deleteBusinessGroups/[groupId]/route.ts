import { NextResponse, NextRequest } from 'next/server';
import { db, businessGroups } from '@/app/db';
import { eq } from 'drizzle-orm';

// MÉTODO DELETE:
export async function DELETE(
  request: NextRequest,
  { params }: { params: { groupId: string } },
) {
  try {
    const { groupId } = params; // Captura o ID da URL
    const id = Number(groupId); // Converte para número

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    // Tenta deletar o grupo empresarial
    const deletedGroup = await db
      .delete(businessGroups)
      .where(eq(businessGroups.id, id))
      .returning({
        id: businessGroups.id,
        name: businessGroups.name,
        createdAt: businessGroups.createdAt,
      });

    if (!deletedGroup.length) {
      return NextResponse.json(
        { error: 'Grupo empresarial não encontrado' },
        { status: 404 },
      );
    }

    return NextResponse.json({ businessGroup: deletedGroup[0] });
  } catch (error) {
    console.error('Erro ao deletar grupo:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 },
    );
  }
}
