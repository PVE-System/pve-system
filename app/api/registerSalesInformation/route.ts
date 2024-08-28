import { NextRequest, NextResponse } from 'next/server';
import { salesInformation, users } from '@/app/db/schema';
import { db } from '@/app/db';

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
        updatedAt: new Date(), // Definindo o updatedAt
      })
      .returning({
        id: salesInformation.id,
        clientId: salesInformation.clientId,
      });

    return NextResponse.json(newSalesInformation, { status: 200 });
  } catch (error) {
    console.error('Error registering sales information:', error);
    return NextResponse.json(
      { error: 'Failed to register sales information' },
      { status: 500 },
    );
  }
}
