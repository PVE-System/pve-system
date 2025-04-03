import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesQuotes, clients, users } from '@/app/db/schema';
import { eq, inArray, and, gte, lt } from 'drizzle-orm';

//OBS: O que conecta users e clients é users.operatorNumber com clients.responsibleSeller.

export async function GET(request: NextRequest) {
  const operatorNumber = request.nextUrl.searchParams.get('userId'); // Recebe userId, mas na verdade é o operatorNumber

  if (!operatorNumber) {
    return NextResponse.json(
      { error: 'Operator Number is required' },
      { status: 400 },
    );
  }

  try {
    console.log('🔹 Recebendo requisição para operatorNumber:', operatorNumber);

    // Buscar usuário pelo operatorNumber
    const user = await db.query.users.findFirst({
      where: eq(users.operatorNumber, operatorNumber),
      columns: { operatorNumber: true },
    });

    console.log('🔹 Usuário encontrado:', user);

    if (!user) {
      console.log(
        '⚠️ Nenhum usuário encontrado para operatorNumber:',
        operatorNumber,
      );
      return NextResponse.json({
        quotes: [],
        quotesCountByClient: {},
        quoteNumbersSumByClient: {},
      });
    }

    // Buscar clientes vinculados ao operatorNumber (responsibleSeller)
    const userClients = await db
      .select({ id: clients.id })
      .from(clients)
      .where(eq(clients.responsibleSeller, operatorNumber))
      .execute();

    console.log('🔹 Clientes vinculados encontrados:', userClients);

    if (userClients.length === 0) {
      console.log('⚠️ Nenhum cliente vinculado encontrado!');
      return NextResponse.json({
        quotes: [],
        quotesCountByClient: {},
        quoteNumbersSumByClient: {},
      });
    }

    // Definir ano atual e intervalo de datas
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // 01/01/AAAA
    const startOfNextYear = new Date(currentYear + 1, 0, 1); // 01/01/AAAA+1

    // Buscar cotações SOMENTE do ano atual
    const clientIds = userClients.map((client) => client.id);
    console.log('🔹 IDs dos clientes:', clientIds);

    const quotes = await db
      .select({
        id: salesQuotes.id,
        clientId: salesQuotes.clientId,
        quoteNumber: salesQuotes.quoteNumber,
        date: salesQuotes.date,
      })
      .from(salesQuotes)
      .where(
        and(
          inArray(salesQuotes.clientId, clientIds),
          gte(salesQuotes.date, startOfYear), // Filtra cotações a partir de 01/01 do ano atual
          lt(salesQuotes.date, startOfNextYear), // Filtra cotações antes de 01/01 do próximo ano
        ),
      )
      .execute();

    console.log('🔹 Cotações filtradas para o ano atual:', quotes);

    if (quotes.length === 0) {
      console.log('⚠️ Nenhuma cotação encontrada para o ano atual!');
    }

    // ✅ **Criando os objetos de agregação**
    const quotesCountByClient: Record<string, number> = {};

    quotes.forEach((quote) => {
      const clientId = String(quote.clientId);
      quotesCountByClient[clientId] = (quotesCountByClient[clientId] || 0) + 1;
    });

    console.log(
      '📊 Contagem de cotações por cliente (Apenas do ano atual):',
      quotesCountByClient,
    );

    return NextResponse.json({
      quotes,
      quotesCountByClient,
      quoteNumbersSumByClient: {}, // Removido da contagem pois não está mais sendo usado
    });
  } catch (error) {
    console.error('❌ Erro no backend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales quotes' },
      { status: 500 },
    );
  }
}
