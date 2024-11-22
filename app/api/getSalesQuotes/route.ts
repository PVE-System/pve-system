import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesQuotes } from '@/app/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('clientId');
  const year = request.nextUrl.searchParams.get('year');

  if (!clientId || !year) {
    return NextResponse.json(
      { error: 'Client ID and year are required' },
      { status: 400 },
    );
  }

  try {
    const quotes = await db
      .select({
        id: salesQuotes.id,
        quoteIdentifier: salesQuotes.quoteName,
        date: salesQuotes.date,
      })
      .from(salesQuotes)
      .where(
        and(
          eq(salesQuotes.clientId, Number(clientId)),
          sql`EXTRACT(YEAR FROM ${salesQuotes.date}) = ${Number(year)}`,
        ),
      )
      .execute();

    return NextResponse.json({ quotes, total: quotes.length });
  } catch (error) {
    console.error('Error fetching sales quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales quotes' },
      { status: 500 },
    );
  }
}
