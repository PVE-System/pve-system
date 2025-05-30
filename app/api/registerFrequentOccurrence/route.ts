import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { frequentOccurrences } from '@/app/db/schema';
import { clients, users } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const {
      clientId,
      userId,
      problem,
      solution,
      conclusion,
      attachments,
      attachmentsList,
    } = await request.json();

    if (!clientId || !userId) {
      return NextResponse.json(
        { error: 'Client ID and User ID are required' },
        { status: 400 },
      );
    }

    // Obtenha os dados do cliente
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
      .execute();

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Obtenha os dados do usuário
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Insira a nova ocorrência no banco de dados
    const [newOccurrence] = await db
      .insert(frequentOccurrences)
      .values({
        clientId,
        userId,
        problem,
        solution,
        conclusion,
        attachments,
        attachmentsList,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .execute();

    return NextResponse.json({
      success: true,
      result: newOccurrence,
    });
  } catch (error) {
    console.error('Error adding frequent occurrence:', error);
    return NextResponse.json(
      { error: 'Failed to add frequent occurrence' },
      { status: 500 },
    );
  }
}
