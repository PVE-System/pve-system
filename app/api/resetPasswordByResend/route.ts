// /api/resetPasswordByAdmin/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { db, users } from '@/app/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { id, password } = await request.json();

    if (!id || !password) {
      return NextResponse.json(
        { error: 'ID do usuário ou senha ausente.' },
        { status: 400 },
      );
    }

    // Verificar se o usuário existe
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)))
      .limit(1);

    const existingUser = user[0];

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado.' },
        { status: 404 },
      );
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Atualiza a senha do usuário
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, Number(id)));

    return NextResponse.json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    console.error('Erro ao redefinir a senha:', error);
    return NextResponse.json(
      { error: 'Erro interno ao redefinir a senha.' },
      { status: 500 },
    );
  }
}
