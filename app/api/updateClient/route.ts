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

  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    console.error('Invalid Client ID');
    return NextResponse.json({ error: 'Invalid Client ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log('Request body:', body);

    // Verifique se o cliente existe antes de atualizar
    const existingClient = await db
      .select()
      .from(clients)
      .where(eq(clients.id, idNumber))
      .limit(1);

    if (existingClient.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const updatedClient = await db
      .update(clients)
      .set({
        ...body,
        imageUrl: body.imageUrl, // Certifique-se de incluir imageUrl
      })
      .where(eq(clients.id, idNumber))
      .returning({
        id: clients.id,
        companyName: clients.companyName,
        emailCommercial: clients.emailCommercial,
        phone: clients.phone,
        rating: clients.rating,
        clientCondition: clients.clientCondition,
        imageUrl: clients.imageUrl, // Inclua imageUrl no retorno
      })
      .execute();

    return NextResponse.json({ client: updatedClient });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client data' },
      { status: 500 },
    );
  }
}
