export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db/db';
import { clients, salesQuotes } from '@/app/db/schema';
import { sql, count, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Verificar token de autenticação para cron jobs
    const cronSecret = request.headers.get('x-cron-secret');
    const expectedSecret = process.env.CRON_SECRET;

    if (!cronSecret || cronSecret !== expectedSecret) {
      console.log('[CRON] Tentativa de acesso não autorizada');
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized - Token inválido',
          timestamp: new Date().toISOString(),
        },
        { status: 401 },
      );
    }
    // Criar data no fuso horário do Brasil (UTC-3)
    const now = new Date();
    const brazilTime = new Date(now.getTime() - 3 * 60 * 60 * 1000); // UTC-3

    const day = brazilTime.getDate();
    const month = brazilTime.getMonth() + 1; // getMonth() retorna 0-11

    // Verificar se é 1º de janeiro (1/1) ou 1º de julho (1/7) no horário do Brasil
    const shouldUpdate =
      (day === 28 && month === 10) || (day === 1 && month === 7);

    // Para testar sempre (independente da data):
    // http://localhost:3000/api/cron/updateClientRatingAutomatic
    // const shouldUpdate = true;

    if (!shouldUpdate) {
      return NextResponse.json({
        success: true,
        message:
          'Hoje não é um dia de atualização automática (horário do Brasil)',
        date: brazilTime.toISOString(),
        day,
        month,
        timezone: 'Brazil/UTC-3',
      });
    }

    console.log(
      `[CRON] Iniciando atualização automática de rating em ${brazilTime.toISOString()} (horário do Brasil)`,
    );

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
        if (quotesCount < 20) {
          newRating = 1;
        } else if (quotesCount <= 100) {
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

    // Log da execução
    console.log(
      `[CRON] Rating atualizado automaticamente: ${updatedCount} clientes atualizados`,
    );

    return NextResponse.json({
      success: true,
      message: `Atualização automática executada: ${updatedCount} clientes atualizados`,
      updatedCount,
      date: brazilTime.toISOString(),
      timezone: 'Brazil/UTC-3',
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('[CRON] Erro na atualização automática:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro na atualização automática',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        date: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
