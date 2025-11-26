// 🔗 Mapeamento entre clients.responsibleSeller e users.operatorNumber
//
// A tabela `clients` não possui uma chave estrangeira direta para a tabela `users`.
// No entanto, o campo `responsibleSeller` em `clients` armazena o mesmo valor que `operatorNumber` em `users`.
// Mantendo uma relação entre as tabelas sem a necessidade de uma foreign key
//
// Neste trecho, extraímos todos os vendedores responsaveis (ou seja, os operatorNumbers) únicos dos clientes filtrados
// e buscamos os usuários correspondentes na tabela `users`.
// Criamos um mapa (userMap) que associa cada operatorNumber ao nome do usuário,
// e utilizamos esse mapa para exibir o nome do vendedor responsável (ex: "123 - João") no lugar de apenas "123".
//
// Essa abordagem simula uma relação entre as tabelas sem a necessidade de uma foreign key explícita.
// É útil em cenários onde não se deseja ou não se pode alterar o schema do banco de dados.
//
// ⚠️ IMPORTANTE: Essa lógica depende de a correspondência entre `responsibleSeller` e `operatorNumber` ser consistente.
// Caso haja alterações na estrutura de dados no futuro, essa dependência deve ser considerada.

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { clients, salesQuotes, users } from '@/app/db/schema';
import { businessGroups } from '@/app/db/schema';
import { inArray, and, between } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const stateFilter = request.nextUrl.searchParams.get('state');
  const yearParam = request.nextUrl.searchParams.get('year');
  const monthParam = request.nextUrl.searchParams.get('month');

  const year = yearParam ? parseInt(yearParam) : null;
  const month =
    monthParam && monthParam !== 'TODOS' ? parseInt(monthParam) : null;

  try {
    // 1. Buscar todos os clientes
    const allClients = await db.select().from(clients);

    // 2. Filtrar por estado
    let filteredClients = allClients;
    if (stateFilter && stateFilter !== 'TODOS CLIENTES') {
      if (stateFilter === 'OUTRAS UF') {
        filteredClients = allClients.filter(
          (client) => client.state !== 'MS' && client.state !== 'MT',
        );
      } else {
        filteredClients = allClients.filter(
          (client) => client.state === stateFilter,
        );
      }
    }

    const clientIds = filteredClients.map((c) => c.id);

    // 3. Construir filtro de data (createdAt)
    let dateFilter = undefined;
    if (year) {
      const start = new Date(year, month ? month - 1 : 0, 1);
      const end = month ? new Date(year, month, 1) : new Date(year + 1, 0, 1);

      dateFilter = between(salesQuotes.createdAt, start, end);
    }

    // 4. Buscar cotações com filtro de cliente e (opcional) data
    const whereConditions = [inArray(salesQuotes.clientId, clientIds)];
    if (dateFilter) {
      whereConditions.push(dateFilter);
    }

    const quotes = await db
      .select({
        id: salesQuotes.id,
        quoteName: salesQuotes.quoteName,
        clientId: salesQuotes.clientId,
        quotesSuccess: salesQuotes.quotesSuccess,
      })
      .from(salesQuotes)
      .where(and(...whereConditions));

    // 5. Buscar usuários
    const operatorNumbers = [
      ...new Set(filteredClients.map((c) => c.responsibleSeller)),
    ];
    const matchedUsers = await db
      .select({
        operatorNumber: users.operatorNumber,
        name: users.name,
      })
      .from(users)
      .where(inArray(users.operatorNumber, operatorNumbers));

    const userMap = Object.fromEntries(
      matchedUsers.map((u) => [
        u.operatorNumber,
        `${u.operatorNumber} - ${u.name}`,
      ]),
    );
    // 5. Buscar Grupo empresarial
    const businessGroupMap = await db
      .select({
        id: businessGroups.id,
        name: businessGroups.name,
      })
      .from(businessGroups);

    const groupNameMap = Object.fromEntries(
      businessGroupMap.map((group) => [group.id, group.name]),
    );

    // 7. Agrupar clientes com suas cotações
    const clientMap = filteredClients.reduce(
      (acc, client) => {
        acc[client.id] = {
          id: client.id,
          companyName: client.companyName,
          state: client.state,
          responsibleSeller:
            userMap[client.responsibleSeller] ?? client.responsibleSeller,
          cnpj: client.cnpj,
          cpf: client.cpf,
          corfioCode: client.corfioCode,
          city: client.city,
          businessGroup: client.businessGroupId
            ? groupNameMap[client.businessGroupId] ?? ''
            : '',

          quotes: [],
        };
        return acc;
      },
      {} as Record<number, any>,
    );

    for (const quote of quotes) {
      if (clientMap[quote.clientId]) {
        clientMap[quote.clientId].quotes.push({
          id: quote.id,
          quoteName: quote.quoteName,
          quotesSuccess: quote.quotesSuccess,
        });
      }
    }

    const clientsWithQuotes = Object.values(clientMap).filter(
      (client) => client.quotes.length > 0,
    );

    const sortedClientsWithQuotes = clientsWithQuotes.sort((a, b) => {
      const normalize = (str: string) => str.trim().toLowerCase();
      const valA = normalize(a.companyName);
      const valB = normalize(b.companyName);

      const startsWithNumberA = /^\d/.test(valA);
      const startsWithNumberB = /^\d/.test(valB);

      if (startsWithNumberA && !startsWithNumberB) return 1;
      if (!startsWithNumberA && startsWithNumberB) return -1;

      return valA.localeCompare(valB, 'pt-BR', { sensitivity: 'base' });
    });

    return NextResponse.json({ clientsWithQuotes: sortedClientsWithQuotes });
  } catch (error) {
    console.error('Erro ao buscar cotações por estado:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar cotações' },
      { status: 500 },
    );
  }
}
