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

  // 🔥 Pegando a role do usuário
  const userRole = existingUser.role; // Certifique-se de que a role existe no banco!

  // Verificar a senha
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password,
  );
  if (!isPasswordCorrect) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  }

  // Gerar token JWT incluindo a role
  const token = jwt.sign(
    { id: existingUser.id, email: existingUser.email, role: userRole }, // Adicionamos a role aqui!
    JWT_SECRET,
    { expiresIn: '1h' },
  );

  // Retornar o token, ID do usuário e role
  return NextResponse.json(
    { token, userId: existingUser.id, role: userRole }, // Incluímos a role na resposta!
    { status: 200 },
  );
}
