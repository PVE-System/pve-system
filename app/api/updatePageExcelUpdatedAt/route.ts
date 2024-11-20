import { db } from '@/app/db';
import { pageViews } from '@/app/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Atualiza `pageExcelUpdatedAt` para todos os usuários
    await db
      .update(pageViews)
      .set({ pageExcelUpdatedAt: new Date() })
      .execute();
    console.log(`Updated pageExcelUpdatedAt time for all users`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating pageExcelUpdatedAt time:', error);
    return NextResponse.json(
      { error: 'Failed to update pageExcelUpdatedAt time' },
      { status: 500 },
    );
  }
}
