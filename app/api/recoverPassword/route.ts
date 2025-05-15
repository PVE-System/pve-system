/* import { NextResponse, NextRequest } from 'next/server';
import { db, users } from '@/app/db';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

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

  // Gerar um token de recuperação de senha com expiração de 30 minutos
  const resetToken = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    JWT_SECRET,
    { expiresIn: '30m' }, // Token válido por 30 minutos
  );

  // Configurar a data de expiração para 30 minutos a partir de agora
  const resetTokenExpiration = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

  // Atualizar o usuário no banco de dados com o token e a expiração
  await db
    .update(users)
    .set({ resetToken, resetTokenExpiration })
    .where(eq(users.id, existingUser.id));

  // Responder ao frontend com sucesso
  return NextResponse.json(
    { message: 'Um link de recuperação foi enviado para o seu e-mail.' },
    { status: 200 },
  );
}
 */

/* import { NextResponse, NextRequest } from 'next/server';
import { db, users } from '@/app/db';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const MAILGUN_API_KEY =
  process.env.MAILGUN_API_KEY ||
  '04cf2007620e1ead7367dfc8433a1fc6-d010bdaf-21648f2c';
const DOMAIN = 'sandboxcee624e93d4f455ead0ad1b9974f97ec.mailgun.org';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });

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
    await mg.messages.create(DOMAIN, {
      from: 'PVE System <mailgun@sandboxcee624e93d4f455ead0ad1b9974f97ec.mailgun.org>',
      to: email,
      subject: 'Recuperação de Senha',
      text: 'Aqui está o seu link de recuperação de senha!',
      html: `<p>Clique aqui para redefinir sua senha: <a href="https://pve-system.vercel.app/reset-password?token=${token}">Redefinir Senha</a></p>`,
    });
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
} */
