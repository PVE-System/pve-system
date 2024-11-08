import { NextResponse } from 'next/server';
import { clients } from '@/app/db/schema';
import { db } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const { cnpj, cpf } = await req.json();

  try {
    let duplicate;

    if (cnpj) {
      duplicate = await db
        .select()
        .from(clients)
        .where(eq(clients.cnpj, cnpj))
        .limit(1);
    } else if (cpf) {
      duplicate = await db
        .select()
        .from(clients)
        .where(eq(clients.cpf, cpf))
        .limit(1);
    }

    if (duplicate && duplicate.length > 0) {
      return NextResponse.json({ duplicate: true, client: duplicate[0] });
    } else {
      return NextResponse.json({ duplicate: false });
    }
  } catch (error) {
    console.error('Erro ao verificar duplicata:', error);
    return NextResponse.json(
      { message: 'Erro ao verificar duplicata' },
      { status: 500 },
    );
  }
}
