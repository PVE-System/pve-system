import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { comments, users } from '@/app/db/schema'; // Certifique-se de importar a tabela users
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
    const { favorite } = body;

    const updateResult = await db
      .update(comments)
      .set({ favorite, date: new Date() })
      .where(eq(comments.id, commentIdNumber))
      .returning({
        id: comments.id,
        clientId: comments.clientId,
        comment: comments.comment,
        favorite: comments.favorite,
        date: comments.date,
        userId: comments.userId,
      });

    if (updateResult.length === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const updatedComment = updateResult[0];

    // Buscar o nome do usuário associado ao comentário
    const user = await db
      .select({
        userName: users.name,
      })
      .from(users)
      .where(eq(users.id, updatedComment.userId))
      .execute();

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formattedComment = {
      ...updatedComment,
      date: updatedComment.date.toISOString(),
      userName: user[0].userName, // Adiciona o userName à resposta
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
