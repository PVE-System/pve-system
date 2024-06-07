import { NextRequest, NextResponse } from 'next/server';
import { clients } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function DELETE(request: NextRequest) {
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
    const deletedClient = await db
      .delete(clients)
      .where(eq(clients.id, Number(id)))
      .returning();

    console.log('Deleted client data:', deletedClient); // Log the deleted client data

    if (!deletedClient.length) {
      console.error('Client not found');
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Client deleted successfully', data: deletedClient },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting client data:', error);
    return NextResponse.json(
      { error: 'Failed to delete client data' },
      { status: 500 },
    );
  }
}
