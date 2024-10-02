import { NextRequest, NextResponse } from 'next/server';
import {
  clients,
  comments,
  salesInformation,
  tabsViewed,
} from '@/app/db/schema'; // Adicione a tabela tabs_viewed
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
    console.log(`Attempting to delete client with id: ${id}`);

    // Verifique se há registros na tabela `tabs_viewed`
    const tabsViewedCheck = await db
      .select()
      .from(tabsViewed)
      .where(eq(tabsViewed.clientId, Number(id)));
    console.log(`Tabs viewed found: `, tabsViewedCheck);

    // Se houver registros em `tabs_viewed`, deletá-los
    if (tabsViewedCheck.length > 0) {
      const deletedTabsViewed = await db
        .delete(tabsViewed)
        .where(eq(tabsViewed.clientId, Number(id)))
        .returning();
      console.log('Deleted tabs viewed data:', deletedTabsViewed);
    }

    // Deletar as informações de vendas
    const deletedSalesInformation = await db
      .delete(salesInformation)
      .where(eq(salesInformation.clientId, Number(id)))
      .returning();
    console.log('Deleted sales information data:', deletedSalesInformation);

    // Deletar os comentários
    const deletedComments = await db
      .delete(comments)
      .where(eq(comments.clientId, Number(id)))
      .returning();
    console.log('Deleted comments data:', deletedComments);

    // Deletar o cliente
    const deletedClient = await db
      .delete(clients)
      .where(eq(clients.id, Number(id)))
      .returning();
    console.log('Deleted client data:', deletedClient);

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
