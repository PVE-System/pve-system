import { NextRequest, NextResponse } from 'next/server';
import { frequentOccurrences } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    console.error('ID da ocorrência é obrigatório');
    return NextResponse.json(
      { error: 'ID da ocorrência é obrigatório' },
      { status: 400 },
    );
  }

  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    console.error('ID da ocorrência inválido');
    return NextResponse.json(
      { error: 'ID da ocorrência inválido' },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    console.log('Request body:', body);

    // Validação do occurrencesStatus
    if (
      !body.occurrencesStatus ||
      !['EM_ABERTO', 'CONCLUIDO'].includes(body.occurrencesStatus)
    ) {
      return NextResponse.json(
        { error: 'Status inválido. Deve ser EM_ABERTO ou CONCLUIDO' },
        { status: 400 },
      );
    }

    // Verifica se a ocorrência existe antes de atualizar
    const existingOccurrence = await db
      .select()
      .from(frequentOccurrences)
      .where(eq(frequentOccurrences.id, idNumber))
      .limit(1);

    if (existingOccurrence.length === 0) {
      return NextResponse.json(
        { error: 'Ocorrência não encontrada' },
        { status: 404 },
      );
    }

    const updatedOccurrence = await db
      .update(frequentOccurrences)
      .set({
        problem: body.problem,
        solution: body.solution,
        conclusion: body.conclusion,
        occurrencesStatus: body.occurrencesStatus,
        updatedAt: new Date(),
      })
      .where(eq(frequentOccurrences.id, idNumber))
      .returning({
        id: frequentOccurrences.id,
        problem: frequentOccurrences.problem,
        solution: frequentOccurrences.solution,
        conclusion: frequentOccurrences.conclusion,
        occurrencesStatus: frequentOccurrences.occurrencesStatus,
        updatedAt: frequentOccurrences.updatedAt,
      })
      .execute();

    if (!updatedOccurrence || updatedOccurrence.length === 0) {
      throw new Error('Falha ao atualizar ocorrência');
    }

    return NextResponse.json({ occurrence: updatedOccurrence[0] });
  } catch (error) {
    console.error('Erro ao atualizar ocorrência:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar ocorrência' },
      { status: 500 },
    );
  }
}
