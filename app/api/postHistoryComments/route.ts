// /api/postHistoryComments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { comments } from '@/app/db/schema';

export async function POST(request: NextRequest) {
  try {
    const { clientId, comment } = await request.json();

    if (!clientId || !comment) {
      return NextResponse.json(
        { error: 'Client ID and comment are required' },
        { status: 400 },
      );
    }

    const newComment = await db
      .insert(comments)
      .values({
        clientId: Number(clientId),
        comment,
        favorite: false, //definindo favorito como falso
      })
      .returning({
        id: comments.id,
        clientId: comments.clientId,
      })
      .execute();

    return NextResponse.json(newComment, { status: 200 });
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Failed to post comment' },
      { status: 500 },
    );
  }
}
