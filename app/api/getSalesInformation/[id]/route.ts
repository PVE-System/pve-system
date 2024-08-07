import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { salesInformation, clients } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('id'); // Usar clientId em vez de id

  if (!clientId) {
    console.error('Client ID is required');
    return NextResponse.json(
      { error: 'Client ID is required' },
      { status: 400 },
    );
  }

  try {
    console.log('Fetching sales information for client ID:', clientId);

    const salesInfo = await db
      .select()
      .from(salesInformation)
      .where(eq(salesInformation.clientId, Number(clientId))) // Buscar por clientId
      .execute();

    if (salesInfo.length === 0) {
      console.warn('Sales information not found for client ID:', clientId);
      return NextResponse.json(
        { error: 'Sales information not found' },
        { status: 404 },
      );
    }

    console.log('Sales information found:', salesInfo);

    const clientInfo = await db
      .select()
      .from(clients)
      .where(eq(clients.id, Number(clientId))) // Garantir que estamos buscando o cliente correto
      .execute();

    if (clientInfo.length === 0) {
      console.warn('Client not found for ID:', clientId);
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    console.log('Client information found:', clientInfo);

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
