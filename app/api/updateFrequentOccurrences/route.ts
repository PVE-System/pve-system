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

    // Quando concluir, garantir que os campos estão preenchidos corretamente e não usam a frase padrão
    const DEFAULT_CONCLUSION_MESSAGE =
      'Esta ocorrência está em aberto, atualize futuramente quando concluir.';

    const problem = typeof body.problem === 'string' ? body.problem.trim() : '';
    const solution =
      typeof body.solution === 'string' ? body.solution.trim() : '';
    const conclusion =
      typeof body.conclusion === 'string' ? body.conclusion.trim() : '';

    if (body.occurrencesStatus === 'CONCLUIDO') {
      if (!problem || !solution || !conclusion) {
        return NextResponse.json(
          {
            error:
              'Não é possível concluir a ocorrência com campos em branco. Informe problema, ações e conclusão.',
          },
          { status: 400 },
        );
      }

      if (conclusion === DEFAULT_CONCLUSION_MESSAGE) {
        return NextResponse.json(
          {
            error:
              'Para concluir a ocorrência, é necessário informar o relato sobre a conclusão.',
          },
          { status: 400 },
        );
      }
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
        problem: problem,
        solution: solution,
        conclusion: conclusion,
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
