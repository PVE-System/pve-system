import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { comments } from '@/app/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('id');

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
      .orderBy(sql`${comments.favorite} DESC, ${comments.date} DESC`)
      .execute();

    // Formatando a data para ISO 8601 antes de retornar
    const formattedComments = commentsData.map((comment) => ({
      ...comment,
      date: comment.date.toISOString(), // Garante que a data está em formato ISO 8601
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
