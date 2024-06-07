import { NextRequest, NextResponse } from 'next/server';
import { clients } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    console.error('Client ID is required');
    return NextResponse.json(
      { error: 'Client ID is required' },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    console.log('Request body:', body); // Log the request body

    // Foi necessario remover o campo `createdAt` do objeto de atualização para funcionar update(desestruturação" de objetos JS, combinada com o operador de espalhamento)
    const { createdAt, ...updateBody } = body;

    const updatedClient = await db
      .update(clients)
      .set(updateBody)
      .where(eq(clients.id, Number(id)))
      .returning();

    console.log('Updated client data:', updatedClient); // Log the updated client data

    if (!updatedClient.length) {
      console.error('Client not found');
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Client updated successfully', data: updatedClient },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating client data:', error);
    return NextResponse.json(
      { error: 'Failed to update client data' },
      { status: 500 },
    );
  }
}
