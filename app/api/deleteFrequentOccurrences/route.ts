import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { frequentOccurrences } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID da ocorrência é obrigatório' },
        { status: 400 },
      );
    }

    const [deletedOccurrence] = await db
      .delete(frequentOccurrences)
      .where(eq(frequentOccurrences.id, id))
      .returning()
      .execute();

    if (!deletedOccurrence) {
      return NextResponse.json(
        { error: 'Ocorrência não encontrada' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Ocorrência deletada com sucesso' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Erro ao deletar ocorrência:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar ocorrência' },
      { status: 500 },
    );
  }
}
