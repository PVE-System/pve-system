import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { comments } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get('id'); // Usar commentId

  if (!commentId) {
    console.error('Comment ID is required');
    return NextResponse.json(
      { error: 'Comment ID is required' },
      { status: 400 },
    );
  }

  const commentIdNumber = Number(commentId);
  if (isNaN(commentIdNumber)) {
    console.error('Invalid Comment ID');
    return NextResponse.json({ error: 'Invalid Comment ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log('Request body:', body);

    const { favorite } = body;

    console.log('Updating comment with favorite status:', favorite);

    const updateResult = await db
      .update(comments)
      .set({ favorite, date: new Date() }) // Atualiza também a data no formato correto
      .where(eq(comments.id, commentIdNumber))
      .returning({
        id: comments.id,
        clientId: comments.clientId,
        comment: comments.comment,
        favorite: comments.favorite,
        date: comments.date, // Incluir a data no retorno
      });

    if (updateResult.length === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    console.log('Comment update result:', updateResult);

    // Formata a data para ISO 8601 antes de retornar
    const formattedComment = {
      ...updateResult[0],
      date: updateResult[0].date.toISOString(), // Garante que a data está em formato ISO 8601
    };

    return NextResponse.json(formattedComment, { status: 200 });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 },
    );
  }
}
