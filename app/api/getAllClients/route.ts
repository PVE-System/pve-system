// app/api/getAllClients/route.ts
export const dynamic = 'force-dynamic';

import { db } from '@/app/db';
import { clients, Client, users } from '@/app/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Buscar role e userId dos cookies
    const userRole = request.cookies.get('role')?.value;
    const userId = request.cookies.get('userId')?.value;

    let allClients: Client[];

    if (userRole === 'vendedor externo' && userId) {
      // Para vendedor externo, buscar o operatorNumber do usuário
      const user = await db
        .select({ operatorNumber: users.operatorNumber })
        .from(users)
        .where(eq(users.id, parseInt(userId)))
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 },
        );
      }

      const operatorNumber = user[0].operatorNumber;

      // Filtrar clientes pelo responsibleSeller que corresponde ao operatorNumber
      allClients = await db
        .select()
        .from(clients)
        .where(eq(clients.responsibleSeller, operatorNumber));
    } else {
      // Outros usuários veem todos os clientes
      allClients = await db.select().from(clients);
    }

    // Revalidar a tag 'clients' para garantir que o cache seja atualizado
    revalidateTag('clients');

    // Criar a resposta JSON com a lista de clientes
    return NextResponse.json({ clients: allClients });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro ao processar os dados' },
      { status: 500 },
    );
  }
}
