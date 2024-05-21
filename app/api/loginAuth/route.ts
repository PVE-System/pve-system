import { NextResponse, NextRequest } from 'next/server';
import { db, usersTeam } from '@/app/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret'; // Deve ser uma variável de ambiente

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Verifica se o usuário existe
  const user = await db
    .select()
    .from(usersTeam)
    .where(eq(usersTeam.email, email))
    .limit(1);

  if (user.length === 0) {
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 404 },
    );
  }

  const existingUser = user[0];

  // Verifica se a senha está correta
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password,
  );
  if (!isPasswordCorrect) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  }

  // Gera o token JWT
  const token = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    JWT_SECRET,
    { expiresIn: '1h' },
  );

  return NextResponse.json({ token });
}
