import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { pageViews } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const userIdNum = Number(userId);

  try {
    await db
      .update(pageViews)
      .set({ pageDashboardUpdatedAt: new Date() })
      .where(eq(pageViews.userId, userIdNum))
      .execute();

    console.log(`Updated pageDashboardUpdatedAt for user ID ${userIdNum}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating pageDashboardUpdatedAt:', error);
    return NextResponse.json(
      { error: 'Failed to update pageDashboardUpdatedAt' },
      { status: 500 },
    );
  }
}
