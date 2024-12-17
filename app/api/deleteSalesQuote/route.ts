import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesQuotes } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = Number(searchParams.get('id'));

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 },
      );
    }

    // Deleta a cotação do banco de dados
    await db.delete(salesQuotes).where(eq(salesQuotes.id, quoteId)).execute();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sales quote:', error);
    return NextResponse.json(
      { error: 'Failed to delete sales quote' },
      { status: 500 },
    );
  }
}
