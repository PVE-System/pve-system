import { NextRequest, NextResponse } from 'next/server';
import { comments } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get('id');

  if (!commentId) {
    console.error('Comment ID is required');
    return NextResponse.json(
      { error: 'Comment ID is required' },
      { status: 400 },
    );
  }

  try {
    // Deletar comentário da tabela comments com base no commentId
    const deletedComment = await db
      .delete(comments)
      .where(eq(comments.id, Number(commentId))) // Usar comments.id para filtrar pelo commentId
      .returning();

    console.log('Deleted Comment data:', deletedComment);

    if (!deletedComment.length) {
      console.error('Comment not found');
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Comment deleted successfully', data: deletedComment },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting Comment data:', error);
    return NextResponse.json(
      { error: 'Failed to delete Comment data' },
      { status: 500 },
    );
  }
}
