import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesQuotes } from '@/app/db/schema';
import { and, eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json(
      { error: 'Client ID is required' },
      { status: 400 },
    );
  }

  const clientIdNumber = Number(clientId);
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  try {
    const results = await Promise.all(
      years.map(async (year) => {
        const quotes = await db
          .select({ id: salesQuotes.id })
          .from(salesQuotes)
          .where(
            and(
              eq(salesQuotes.clientId, clientIdNumber),
              sql`EXTRACT(YEAR FROM ${salesQuotes.date}) = ${year}`,
            ),
          )
          .execute();

        return { year, total: quotes.length };
      }),
    );

    return NextResponse.json({ clientId: clientIdNumber, data: results });
  } catch (error) {
    console.error('Error fetching sales quotes by year range:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales quotes by year range' },
      { status: 500 },
    );
  }
}
