import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { clients, NewClient } from '@/app/db/schema';
import { revalidateTag } from 'next/cache'; // Importar a função de revalidação

export async function POST(request: NextRequest) {
  const newClient: NewClient = await request.json();

  try {
    // Normalização adicional no backend, se necessário
    const clientData = {
      ...newClient,
      companySize: newClient.companySize,
      hasOwnStore: newClient.hasOwnStore,
      icmsContributor: newClient.icmsContributor,
      transportationType: newClient.transportationType,
      companyLocation: newClient.companyLocation,
      marketSegmentNature: newClient.marketSegmentNature,
      state: newClient.state,
      clientCondition: newClient.clientCondition,
      rating: newClient.rating, // Mantém o valor do rating como está
      imageUrl: newClient.imageUrl,
      businessGroupId: newClient.businessGroupId,
    };

    // Inserir novo cliente no banco de dados
    const createdClient = await db
      .insert(clients)
      .values(clientData)
      .returning({
        id: clients.id,
        imageUrl: clients.imageUrl,
      })
      .execute();

    // Revalidar a tag 'clients' para garantir que o cache seja atualizado
    revalidateTag('clients');

    const response = NextResponse.json({ clientId: createdClient[0].id });
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 },
    );
  }
}
