import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { frequentOccurrences } from '@/app/db/schema';
import { clients, users } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Dados recebidos na API:', body);

    const {
      clientId,
      userId,
      problem,
      solution,
      conclusion,
      attachments,
      attachmentsList,
      occurrencesStatus,
    } = body;

    // Validação dos campos obrigatórios
    if (!clientId || !userId) {
      return NextResponse.json(
        { error: 'ID do cliente e usuário são obrigatórios' },
        { status: 400 },
      );
    }

    if (!problem || !solution) {
      return NextResponse.json(
        { error: 'Todos os campos de texto são obrigatórios' },
        { status: 400 },
      );
    }

    // Validação do occurrencesStatus
    if (
      !occurrencesStatus ||
      !['EM_ABERTO', 'CONCLUIDO'].includes(occurrencesStatus)
    ) {
      return NextResponse.json(
        { error: 'Status inválido. Deve ser EM_ABERTO ou CONCLUIDO' },
        { status: 400 },
      );
    }

    // Se o status for EM_ABERTO, usar o texto padrão para conclusion
    const conclusionText =
      occurrencesStatus === 'EM_ABERTO'
        ? 'Esta ocorrência está em aberto, atualize futuramente quando concluir.'
        : conclusion;

    // Obtenha os dados do cliente
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
      .execute();

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 },
      );
    }

    // Obtenha os dados do usuário
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 },
      );
    }

    // Dados para inserção
    const occurrenceData = {
      clientId,
      userId,
      problem,
      solution,
      conclusion: conclusionText,
      occurrencesStatus,
      attachments: attachments || '',
      attachmentsList: attachmentsList || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Dados para inserção:', occurrenceData);

    // Insira a nova ocorrência no banco de dados
    const [newOccurrence] = await db
      .insert(frequentOccurrences)
      .values(occurrenceData)
      .returning()
      .execute();

    return NextResponse.json({
      success: true,
      result: newOccurrence,
    });
  } catch (error) {
    console.error('Erro ao adicionar ocorrência frequente:', error);
    return NextResponse.json(
      { error: 'Falha ao adicionar ocorrência frequente' },
      { status: 500 },
    );
  }
}
