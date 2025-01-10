// app/api/getAllClients/route.ts
import { db } from '@/app/db';
import { clients, Client } from '@/app/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache'; // Importar a função de revalidação

export async function GET(request: NextRequest) {
  // Buscar todos os clientes no banco de dados
  const allClients: Client[] = await db.select().from(clients);

  // Revalidar a tag 'clients' para garantir que o cache seja atualizado
  revalidateTag('clients');

  // Criar a resposta JSON com a lista de clientes
  return NextResponse.json({ clients: allClients });
}
