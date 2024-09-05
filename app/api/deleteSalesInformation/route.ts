import { NextRequest, NextResponse } from 'next/server';
import { salesInformation } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, userId, fieldName } = body;

    if (!clientId || !userId || !fieldName) {
      return NextResponse.json(
        { error: 'Client ID, User ID and field name are required' },
        { status: 400 },
      );
    }

    // Limpa o campo específico
    const updateData = {
      [fieldName]: '*', // Define o campo como vazio
    };

    await db
      .update(salesInformation)
      .set(updateData)
      .where(eq(salesInformation.clientId, Number(clientId)))
      .execute();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting field:', error);
    return NextResponse.json(
      { error: 'Failed to delete field' },
      { status: 500 },
    );
  }
}
