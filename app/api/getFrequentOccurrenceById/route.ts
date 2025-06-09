import { NextRequest, NextResponse } from 'next/server';
import { frequentOccurrences, clients, users } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'ID da ocorrência é obrigatório' },
      { status: 400 },
    );
  }

  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return NextResponse.json(
      { error: 'ID da ocorrência inválido' },
      { status: 400 },
    );
  }

  try {
    const occurrence = await db
      .select({
        id: frequentOccurrences.id,
        problem: frequentOccurrences.problem,
        solution: frequentOccurrences.solution,
        conclusion: frequentOccurrences.conclusion,
        occurrencesStatus: frequentOccurrences.occurrencesStatus,
        attachments: frequentOccurrences.attachments,
        created_at: frequentOccurrences.createdAt,
        client_name: clients.companyName,
        client_corfioCode: clients.corfioCode,
        user_name: users.name,
        operator_number: users.operatorNumber,
      })
      .from(frequentOccurrences)
      .leftJoin(clients, eq(frequentOccurrences.clientId, clients.id))
      .leftJoin(users, eq(frequentOccurrences.userId, users.id))
      .where(eq(frequentOccurrences.id, idNumber))
      .limit(1);

    if (occurrence.length === 0) {
      return NextResponse.json(
        { error: 'Ocorrência não encontrada' },
        { status: 404 },
      );
    }

    const formattedOccurrence = {
      id: occurrence[0].id,
      problem: occurrence[0].problem || '',
      solution: occurrence[0].solution || '',
      conclusion: occurrence[0].conclusion || '',
      occurrencesStatus: occurrence[0].occurrencesStatus || 'EM_ABERTO',
      attachments: occurrence[0].attachments || '',
      created_at: occurrence[0].created_at,
      client_name: occurrence[0].client_name || 'Cliente não encontrado',
      client_corfioCode: occurrence[0].client_corfioCode || '',
      user_name: occurrence[0].user_name
        ? `${occurrence[0].operator_number} - ${occurrence[0].user_name}`
        : 'Usuário não encontrado',
    };

    return NextResponse.json({ occurrence: formattedOccurrence });
  } catch (error) {
    console.error('Erro ao buscar ocorrência:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ocorrência' },
      { status: 500 },
    );
  }
}
