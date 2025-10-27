import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db/db';
import { clients, salesQuotes } from '@/app/db/schema';
import { sql, count, gte } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Calcular a data de 6 meses atrás
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Query para contar cotações por cliente nos últimos 6 meses
    const quotesCountQuery = db
      .select({
        clientId: salesQuotes.clientId,
        quotesCount: count(salesQuotes.id).as('quotes_count'),
      })
      .from(salesQuotes)
      .where(gte(salesQuotes.createdAt, sixMonthsAgo))
      .groupBy(salesQuotes.clientId);

    const quotesCounts = await quotesCountQuery;

    // Criar um mapa para facilitar a busca
    const quotesCountMap = new Map<number, number>();
    quotesCounts.forEach((item) => {
      quotesCountMap.set(item.clientId, item.quotesCount);
    });

    // Buscar todos os clientes
    const allClients = await db.select({ id: clients.id }).from(clients);

    let updatedCount = 0;
    let errors: string[] = [];

    // Atualizar rating de cada cliente
    for (const client of allClients) {
      try {
        const quotesCount = quotesCountMap.get(client.id) || 0;
        let newRating: number;

        // Determinar o rating baseado no número de cotações
        if (quotesCount < 10) {
          newRating = 1;
        } else if (quotesCount <= 50) {
          newRating = 2;
        } else {
          newRating = 3;
        }

        // Atualizar o rating do cliente
        await db
          .update(clients)
          .set({ rating: newRating })
          .where(sql`${clients.id} = ${client.id}`);

        updatedCount++;
      } catch (error) {
        console.error(`Erro ao atualizar cliente ${client.id}:`, error);
        errors.push(
          `Cliente ID ${client.id}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Rating atualizado para ${updatedCount} clientes`,
      updatedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Erro ao atualizar rating dos clientes:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor ao atualizar rating dos clientes',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 },
    );
  }
}
