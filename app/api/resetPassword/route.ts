// api/resetPassword/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { db, users } from '@/app/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token ou senha ausente' },
        { status: 400 },
      );
    }

    // Buscar o usuário pelo token
    const user = await db
      .select()
      .from(users)
      .where(eq(users.resetToken, token.trim()))
      .limit(1);

    const existingUser = user[0];

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 },
      );
    }

    // Verificar se o resetTokenExpiration é válido
    const tokenExpirationDate = existingUser.resetTokenExpiration
      ? new Date(existingUser.resetTokenExpiration)
      : null;

    if (!tokenExpirationDate || tokenExpirationDate < new Date()) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 },
      );
    }

    // Hash da nova senha e atualização do usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetToken: '', // Limpa o token
        resetTokenExpiration: new Date(0), // Zera a expiração do token
      })
      .where(eq(users.id, existingUser.id));

    return NextResponse.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('Erro ao redefinir a senha:', error);
    return NextResponse.json(
      { error: 'Erro ao redefinir a senha' },
      { status: 500 },
    );
  }
}
