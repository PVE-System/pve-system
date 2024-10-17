import { NextResponse, NextRequest } from 'next/server';
import { db, users } from '@/app/db';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const RESEND_API_KEY = process.env.RESEND_API_KEY || 'sua-chave-api';

const resend = new Resend(RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  // Buscar usuário no banco de dados
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 404 },
    );
  }

  const existingUser = user[0];

  // Gerar token de recuperação de senha
  const token = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    JWT_SECRET,
    { expiresIn: '30m' },
  );

  await db
    .update(users)
    .set({
      resetToken: token,
      resetTokenExpiration: new Date(Date.now() + 30 * 60 * 1000),
    })
    .where(eq(users.id, existingUser.id));

  try {
    const response = await resend.emails.send({
      from: 'PVE <onboarding@resend.dev>',
      to: email,
      subject: 'Recuperação de Senha',
      html: `<p>Clique aqui para redefinir sua senha: <a href="https://pve-system.vercel.app/resetPassword?token=${token}">Redefinir Senha</a></p>`,
    });

    console.log('E-mail de recuperação enviado:', response);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return NextResponse.json(
      { error: 'ERRO ao enviar e-mail de recuperação' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: 'Um link de recuperação foi enviado para o seu e-mail',
  });
}
