import { NextRequest, NextResponse } from 'next/server';
import { clients } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Client ID is required' },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const updatedClient = await db
      .update(clients)
      .set(body)
      .where(eq(clients.id, Number(id)))
      .execute();

    if (!updatedClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Client updated successfully' },
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
