// /api/getHistoryComments/[clientId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { comments } from '@/app/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } },
) {
  const { clientId } = params;

  if (!clientId) {
    return NextResponse.json(
      { error: 'Client ID is required' },
      { status: 400 },
    );
  }

  try {
    const commentsData = await db
      .select()
      .from(comments)
      .where(eq(comments.clientId, Number(clientId)))
      .orderBy(desc(comments.favorite), desc(comments.date))
      .execute();

    if (commentsData.length === 0) {
      return NextResponse.json(
        { message: 'No comments found for this client.' },
        { status: 200 },
      );
    }

    const formattedComments = commentsData.map((comment) => ({
      ...comment,
      date: comment.date.toISOString(),
    }));

    return NextResponse.json(formattedComments, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 },
    );
  }
}