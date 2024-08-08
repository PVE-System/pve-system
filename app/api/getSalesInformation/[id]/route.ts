import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesInformation, clients } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    console.error('Client ID is required');
    return NextResponse.json(
      { error: 'Client ID is required' },
      { status: 400 },
    );
  }

  try {
    console.log('Fetching sales information for client ID:', id);

    const salesInfo = await db
      .select()
      .from(salesInformation)
      .where(eq(salesInformation.clientId, Number(id)))
      .execute();

    if (salesInfo.length === 0) {
      console.warn('Sales information not found for client ID:', id);
      return NextResponse.json(
        { error: 'Sales information not found' },
        { status: 404 },
      );
    }

    const clientInfo = await db
      .select()
      .from(clients)
      .where(eq(clients.id, Number(id)))
      .execute();

    if (clientInfo.length === 0) {
      console.warn('Client not found for ID:', id);
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const combinedData = {
      ...salesInfo[0],
      rating: clientInfo[0].rating,
      clientCondition: clientInfo[0].clientCondition,
    };

    console.log('Combined data:', combinedData);

    return NextResponse.json(combinedData, { status: 200 });
  } catch (error) {
    console.error('Error fetching client data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client data' },
      { status: 500 },
    );
  }
}
