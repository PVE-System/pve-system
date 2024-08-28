import { NextRequest, NextResponse } from 'next/server';
import { salesInformation, users } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

// Função para extrair o userId dos cookies
const getUserIdFromCookies = (request: NextRequest): number | null => {
  const cookies = request.cookies;
  const userId = cookies.get('userId')?.value;

  return userId ? Number(userId) : null;
};

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('id'); // Usar clientId

  if (!clientId) {
    return NextResponse.json(
      { error: 'Client ID is required' },
      { status: 400 },
    );
  }

  const clientIdNumber = Number(clientId);
  const userId = getUserIdFromCookies(request);

  if (isNaN(clientIdNumber) || !userId) {
    return NextResponse.json(
      { error: 'Invalid Client ID or User ID' },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const { rating, clientCondition, ...otherData } = body;

    // Obter o nome do usuário
    const user = await db
      .select({ userName: users.name })
      .from(users)
      .where(eq(users.id, userId))
      .execute();

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData = {
      ...otherData,
      userId,
      updatedAt: new Date(), // Atualizar o timestamp para o momento atual como objeto Date
    };

    // Atualizar salesInformation
    await db
      .update(salesInformation)
      .set(updateData)
      .where(eq(salesInformation.clientId, clientIdNumber))
      .execute();

    return NextResponse.json({
      success: true,
      userName: user[0].userName, // Retorna o nome do usuário para renderizar no frontend
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client data' },
      { status: 500 },
    );
  }
}
