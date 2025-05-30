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

  try {
    const occurrence = await db
      .select({
        id: frequentOccurrences.id,
        problem: frequentOccurrences.problem,
        solution: frequentOccurrences.solution,
        conclusion: frequentOccurrences.conclusion,
        attachments: frequentOccurrences.attachments,
        createdAt: frequentOccurrences.createdAt,
        client_name: clients.companyName,
        client_corfioCode: clients.corfioCode,
        user_name: users.name,
        operator_number: users.operatorNumber,
      })
      .from(frequentOccurrences)
      .leftJoin(clients, eq(frequentOccurrences.clientId, clients.id))
      .leftJoin(users, eq(frequentOccurrences.userId, users.id))
      .where(eq(frequentOccurrences.id, Number(id)))
      .execute();

    if (occurrence.length === 0) {
      return NextResponse.json(
        { error: 'Ocorrência não encontrada' },
        { status: 404 },
      );
    }

    const formattedOccurrence = {
      ...occurrence[0],
      created_at: occurrence[0].createdAt,
      user_name: occurrence[0].user_name
        ? `${occurrence[0].operator_number} - ${occurrence[0].user_name}`
        : 'Usuário não encontrado',
    };

    return NextResponse.json(
      { occurrence: formattedOccurrence },
      { status: 200 },
    );
  } catch (error) {
    console.error('Erro ao buscar ocorrência:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ocorrência' },
      { status: 500 },
    );
  }
}
