import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesQuotes } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = Number(searchParams.get('id'));

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { quotesSuccess } = body;

    if (typeof quotesSuccess !== 'boolean') {
      return NextResponse.json(
        { error: 'quotesSuccess must be a boolean' },
        { status: 400 },
      );
    }

    // Atualiza o status da cotação
    await db
      .update(salesQuotes)
      .set({ quotesSuccess })
      .where(eq(salesQuotes.id, quoteId))
      .execute();

    return NextResponse.json({ success: true, quotesSuccess });
  } catch (error) {
    console.error('Error updating sales quote:', error);
    return NextResponse.json(
      { error: 'Failed to update sales quote' },
      { status: 500 },
    );
  }
}
