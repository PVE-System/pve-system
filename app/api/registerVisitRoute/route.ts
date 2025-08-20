import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import {
  visitRoutes,
  visitRouteClients,
  NewVisitRoute,
  NewVisitRouteClient,
} from '@/app/db/schema';
import { eq, and, desc, inArray, isNotNull } from 'drizzle-orm';

interface ClientData {
  clientId?: number;
  customerNameUnregistered?: string;
  customerStateUnregistered?: string;
  customerCityUnregistered?: string;
}

interface VisitRouteRequest {
  userId: number;
  routeName: string;
  scheduledDate: string;
  description?: string;
  clients: ClientData[];
}

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      routeName,
      scheduledDate,
      description,
      clients,
    }: VisitRouteRequest = await request.json();

    // Validações básicas
    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 },
      );
    }

    if (!routeName || routeName.trim() === '') {
      return NextResponse.json(
        { error: 'Nome da rota é obrigatório' },
        { status: 400 },
      );
    }

    if (!scheduledDate || scheduledDate.trim() === '') {
      return NextResponse.json(
        { error: 'Data agendada é obrigatória' },
        { status: 400 },
      );
    }

    // Validar formato da data (DD/MM/AAAA)
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const dateMatch = scheduledDate.match(dateRegex);

    if (!dateMatch) {
      return NextResponse.json(
        { error: 'Formato de data inválido. Use DD/MM/AAAA' },
        { status: 400 },
      );
    }

    const [, day, month, year] = dateMatch;

    // Criar a data em UTC para evitar problemas de fuso horário
    // Como é uma data escolhida pelo usuário, vamos garantir que seja salva corretamente
    const parsedDate = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0),
    );

    // Verificar se a data é válida
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Data inválida' }, { status: 400 });
    }

    if (!clients || clients.length === 0) {
      return NextResponse.json(
        { error: 'Pelo menos um cliente deve ser fornecido' },
        { status: 400 },
      );
    }

    // 1. Criar a rota de visita
    const newRoute: NewVisitRoute = {
      userId,
      routeName: routeName.trim(),
      scheduledDate: parsedDate,
      description: description || null,
      routeStatus: 'EM_ABERTO',
    };

    const createdRoute = await db
      .insert(visitRoutes)
      .values(newRoute)
      .returning({ id: visitRoutes.id })
      .execute();

    const routeId = createdRoute[0].id;

    // 2. Criar os registros dos clientes na rota
    const routeClientsData: NewVisitRouteClient[] = clients.map((client) => ({
      visitRouteId: routeId,
      clientId: client.clientId || null,
      customerNameUnregistered: client.customerNameUnregistered || null,
      customerStateUnregistered: client.customerStateUnregistered || null,
      customerCityUnregistered: client.customerCityUnregistered || null,
      visitStatus: 'AGENDADO',
    }));

    await db.insert(visitRouteClients).values(routeClientsData).execute();

    // 3. Transferir histórico de visitas para clientes cadastrados
    const registeredClients = clients.filter((client) => client.clientId);

    // Status que representam visitas já realizadas (não agendadas)
    const completedStatuses = ['CONCLUIDO', 'PENDENTE', 'DESINTERESSADO'];

    for (const client of registeredClients) {
      if (client.clientId) {
        try {
          // Buscar a última visita do cliente que tenha currentVisitDescription preenchida
          const lastVisit = await db
            .select({
              id: visitRouteClients.id,
              currentVisitDescription:
                visitRouteClients.currentVisitDescription,
              lastVisitConfirmedAt: visitRouteClients.lastVisitConfirmedAt,
              updatedAt: visitRouteClients.updatedAt, // ← Adicionado
            })
            .from(visitRouteClients)
            .where(
              and(
                eq(visitRouteClients.clientId, client.clientId),
                inArray(visitRouteClients.visitStatus, completedStatuses),
                isNotNull(visitRouteClients.currentVisitDescription),
              ),
            )
            .orderBy(desc(visitRouteClients.updatedAt)) // ← Mudança aqui!
            .limit(1);

          if (lastVisit.length > 0) {
            const visit = lastVisit[0];

            // Atualizar a nova visita com o histórico da última visita
            await db
              .update(visitRouteClients)
              .set({
                lastVisitDescription: visit.currentVisitDescription,
                lastVisitConfirmedAt: visit.lastVisitConfirmedAt,
                updatedAt: new Date(),
              })
              .where(
                and(
                  eq(visitRouteClients.clientId, client.clientId),
                  eq(visitRouteClients.visitRouteId, routeId),
                ),
              );
          }
        } catch (error) {
          console.error(
            `Erro ao transferir histórico para cliente ${client.clientId}:`,
            error,
          );
          // Continua o processo mesmo se houver erro em um cliente específico
        }
      }
    }

    return NextResponse.json({
      success: true,
      routeId,
      message: 'Rota criada com sucesso',
    });
  } catch (error: unknown) {
    console.error('Erro ao criar rota:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
