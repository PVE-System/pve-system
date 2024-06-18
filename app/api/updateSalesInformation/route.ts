import { NextRequest, NextResponse } from 'next/server';
import { salesInformation, clients } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('id'); // Usar clientId

  if (!clientId) {
    console.error('Client ID is required');
    return NextResponse.json(
      { error: 'Client ID is required' },
      { status: 400 },
    );
  }

  const clientIdNumber = Number(clientId);
  if (isNaN(clientIdNumber)) {
    console.error('Invalid Client ID');
    return NextResponse.json({ error: 'Invalid Client ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log('Request body:', body);

    const { rating, clientCondition, createdAt, ...otherData } = body; // Remover createdAt

    console.log('Updating salesInformation with:', otherData);

    const updateResult = await db
      .update(salesInformation)
      .set({ ...otherData })
      .where(eq(salesInformation.clientId, clientIdNumber)); // Atualizar usando clientId

    console.log('Sales information update result:', updateResult);

    const clientUpdateResult = await db
      .update(clients)
      .set({ rating, clientCondition })
      .where(eq(clients.id, clientIdNumber)); // Atualizar cliente

    console.log('Client update result:', clientUpdateResult);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client data' },
      { status: 500 },
    );
  }
}
