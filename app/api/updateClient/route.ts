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

    const { rating, clientCondition, ...otherData } = body;

    await db
      .update(clients)
      .set({
        ...otherData,
        rating: rating !== undefined ? rating : undefined,
        clientCondition:
          clientCondition !== undefined ? clientCondition : undefined,
      })
      .where(eq(clients.id, idNumber));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client data' },
      { status: 500 },
    );
  }
}
