import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { comments } from '@/app/db/schema';

// Função para extrair o userId dos cookies
const getUserIdFromCookies = (request: NextRequest): number | null => {
  const cookies = request.cookies;
  const userId = cookies.get('userId')?.value;

  return userId ? Number(userId) : null;
};

export async function POST(request: NextRequest) {
  try {
    const { clientId, comment } = await request.json();
    const userId = getUserIdFromCookies(request); // Extrai o userId dos cookies

    if (!clientId || !comment || !userId) {
      return NextResponse.json(
        { error: 'Client ID, comment, and userId are required' },
        { status: 400 },
      );
    }

    const newComment = await db
      .insert(comments)
      .values({
        clientId: Number(clientId),
        comment,
        favorite: false, // Definindo favorito como falso
        userId: userId, // Usando userId extraído dos cookies
      })
      .returning({
        id: comments.id,
        clientId: comments.clientId,
        userId: comments.userId,
      });

    return NextResponse.json(newComment, { status: 200 });
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Failed to post comment' },
      { status: 500 },
    );
  }
}
