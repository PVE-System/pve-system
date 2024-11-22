import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesQuotes } from '@/app/db/schema';
import { clients, users } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { clientId, userId } = await request.json();

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

    // Obtenha o ano atual
    const currentYear = new Date().getFullYear();

    // Verifique o número da próxima cotação para o cliente
    const countQuotes = await db
      .select()
      .from(salesQuotes)
      .where(eq(salesQuotes.clientId, clientId))
      .execute();

    const newQuoteNumber = countQuotes.length + 1;

    const sanitizeFileName = (name: string) => {
      return name.replace(/[\/\\:*?"<>|]/g, '-'); // Substitui caracteres inválidos por '-'
    };
    //Gerar o nome da cotação
    const quoteName = sanitizeFileName(
      `${currentYear}-${client.cnpj || client.cpf}-${user.operatorNumber}-${newQuoteNumber}`,
    );

    // Insira a nova cotação no banco de dados
    const result = await db
      .insert(salesQuotes)
      .values({
        clientId,
        userId,
        year: currentYear,
        date: new Date(), // Data completa da cotação
        quoteName,
      })
      .execute();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error adding sales quote:', error);
    return NextResponse.json(
      { error: 'Failed to add sales quote' },
      { status: 500 },
    );
  }
}
