import { NextResponse, NextRequest } from 'next/server';
import { db, users } from '@/app/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Buscar usuário no banco de dados
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // Verificar se o usuário existe
  if (user.length === 0) {
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 404 },
    );
  }

  const existingUser = user[0];

  // Verificar a senha
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password,
  );
  if (!isPasswordCorrect) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  }

  // Gerar token JWT
  const token = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    JWT_SECRET,
    { expiresIn: '1h' },
  );

  // Retornar o token e o ID do usuário
  return NextResponse.json(
    { token, userId: existingUser.id }, // Inclua o ID do usuário na resposta
    { status: 200 },
  );
}
