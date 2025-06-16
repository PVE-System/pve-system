// app/api/getAllUsers/route.ts
export const dynamic = 'force-dynamic';

import { db } from '@/app/db';
import { users, User } from '@/app/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache'; // Importar a função de revalidação

export async function GET(request: NextRequest) {
  // Buscar todos os clientes no banco de dados
  const allUsers: User[] = await db.select().from(users);

  // Revalidar a tag 'clients' para garantir que o cache seja atualizado
  revalidateTag('clients');

  // Criar a resposta JSON com a lista de clientes
  return NextResponse.json({ users: allUsers });
}
