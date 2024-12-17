import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesQuotes } from '@/app/db/schema';
import { clients, users } from '@/app/db/schema';
import { eq, max } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { clientId, userId, industry, quoteNumber } = await request.json();

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

    // Obter o último número da cotação para o cliente
    const [lastQuote] = await db
      .select({ maxQuoteNumber: max(salesQuotes.quoteNumber) }) // Use max()
      .from(salesQuotes)
      .where(eq(salesQuotes.clientId, clientId));

    const newQuoteNumber = (lastQuote?.maxQuoteNumber || 0) + 1;

    const sanitizeFileName = (name: string) => {
      return name.replace(/[\/\\:*?"<>|]/g, '-');
    };

    // Obter a data atual no formato ANO-MES-DIA
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

    // Gerar o nome da cotação
    const quoteName = sanitizeFileName(
      `${formattedDate}-${industry}-${client.cnpj || client.cpf}-${user.operatorNumber}-${newQuoteNumber}`,
    );

    // Insira a nova cotação no banco de dados
    const result = await db
      .insert(salesQuotes)
      .values({
        clientId,
        userId,
        year: currentYear,
        date: new Date(),
        quoteName,
        quoteNumber: newQuoteNumber, // Use o valor calculado
        industry,
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
