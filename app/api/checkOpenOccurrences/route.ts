import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { frequentOccurrences } from '@/app/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 },
      );
    }

    // Busca ocorrências abertas para o cliente
    const openOccurrences = await db
      .select()
      .from(frequentOccurrences)
      .where(
        and(
          eq(frequentOccurrences.clientId, parseInt(clientId)),
          eq(frequentOccurrences.occurrencesStatus, 'EM_ABERTO'),
        ),
      );

    return NextResponse.json({
      hasOpenOccurrences: openOccurrences.length > 0,
      occurrences: openOccurrences,
    });
  } catch (error) {
    console.error('Error checking open occurrences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
