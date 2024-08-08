import { NextRequest, NextResponse } from 'next/server';
import { clients } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: 'Client ID is required' },
      { status: 400 },
    );
  }

  try {
    const client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, Number(id))) // Use eq para comparar o ID
      .execute();

    if (client.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching client data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client data' },
      { status: 500 },
    );
  }
}
