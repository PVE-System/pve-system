export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { frequentOccurrences, clients, users } from '@/app/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const occurrences = await db
      .select({
        id: frequentOccurrences.id,
        problem: frequentOccurrences.problem,
        occurrencesStatus: frequentOccurrences.occurrencesStatus,
        solution: frequentOccurrences.solution,
        conclusion: frequentOccurrences.conclusion,
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
      .orderBy(desc(frequentOccurrences.id));

    // Transformar os dados para garantir que todos os campos necessários existam
    const formattedOccurrences = occurrences.map((row) => ({
      id: row.id,
      problem: row.problem || '',
      occurrencesStatus: row.occurrencesStatus || 'EM_ABERTO',
      solution: row.solution || '',
      conclusion: row.conclusion || '',
      attachments: row.attachments || '',
      created_at: row.created_at,
      client_name: row.client_name || 'Cliente não encontrado',
      client_corfioCode: row.client_corfioCode || '',
      user_name: row.user_name
        ? `${row.operator_number} - ${row.user_name}`
        : 'Usuário não encontrado',
    }));

    return NextResponse.json(
      { occurrences: formattedOccurrences },
      { status: 200 },
    );
  } catch (error) {
    console.error('Erro ao buscar ocorrências:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ocorrências' },
      { status: 500 },
    );
  }
}
