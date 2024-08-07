import { NextRequest, NextResponse } from 'next/server';
import { salesInformation } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientId,
      commercial,
      marketing,
      invoicing,
      cables,
      financial,
      invoice,
    } = body;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 },
      );
    }

    const existingSalesInfo = await db
      .select()
      .from(salesInformation)
      .where(eq(salesInformation.clientId, Number(clientId)))
      .execute();

    if (existingSalesInfo.length > 0) {
      return NextResponse.json(
        { error: 'Sales information for this client already exists' },
        { status: 400 },
      );
    }

    const createdSalesInformation = await db
      .insert(salesInformation)
      .values({
        clientId: Number(clientId), // Garantir que clientId está sendo registrado corretamente
        commercial,
        marketing,
        invoicing,
        cables,
        financial,
        invoice,
      })
      .returning({
        id: salesInformation.id,
        clientId: salesInformation.clientId,
      })
      .execute();

    return NextResponse.json({ salesInformation: createdSalesInformation });
  } catch (error) {
    console.error('Error registering sales information:', error);
    return NextResponse.json(
      { error: 'Failed to register sales information' },
      { status: 500 },
    );
  }
}
