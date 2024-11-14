import { db } from '@/app/db';
import { pageViews } from '@/app/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await db.update(pageViews).set({ pageExcel: new Date() }).execute();
    console.log(`Updated page_excel time for all users`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating page_excel time:', error);
    return NextResponse.json(
      { error: 'Failed to update page_excel time' },
      { status: 500 },
    );
  }
}
