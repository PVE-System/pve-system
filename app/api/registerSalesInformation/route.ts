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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientId,
      commercial,
      marketing,
      invoicing,
      cables,
      financial,
      invoice,
    } = body;

    const userId = getUserIdFromCookies(request);

    if (!clientId || !userId) {
      return NextResponse.json(
        { error: 'Client ID and User ID are required' },
        { status: 400 },
      );
    }

    // Obter o nome do usuário
    const user = await db
      .select({ userName: users.name })
      .from(users)
      .where(eq(users.id, userId))
      .execute();

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newSalesInformation = await db
      .insert(salesInformation)
      .values({
        clientId: Number(clientId),
        userId,
        commercial,
        marketing,
        invoicing,
        cables,
        financial,
        invoice,
        updatedAt: new Date(), // Define a data de atualização
      })
      .returning({
        id: salesInformation.id,
        clientId: salesInformation.clientId,
        updatedAt: salesInformation.updatedAt,
      });

    return NextResponse.json({
      ...newSalesInformation[0], // Certifique-se de que está retornando o objeto criado corretamente
      userName: user[0].userName, // Retorne também o nome do usuário
    });
  } catch (error) {
    console.error('Error registering sales information:', error);
    return NextResponse.json(
      { error: 'Failed to register sales information' },
      { status: 500 },
    );
  }
}
