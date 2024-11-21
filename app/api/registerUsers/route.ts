import { NextResponse, NextRequest } from 'next/server';
import { db, users, NewUser } from '@/app/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs'; // Importando bcryptjs
import { pageViews } from '@/app/db/schema';

// METODO POST:

export async function POST(request: NextRequest) {
  const newUser: NewUser = await request.json();

  try {
    // Hash da senha do usuário
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    // Definir o valor padrão para 'role' se não for passado no frontend
    const userRole = newUser.role || 'vendedor';

    // Inserindo o usuário no banco de dados com a senha hasheada e a função (role)
    const [createdUser] = await db
      .insert(users)
      .values({
        email: newUser.email,
        password: hashedPassword,
        name: newUser.name,
        role: userRole,
        operatorNumber: newUser.operatorNumber,
        createdAt: new Date(),
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        operatorNumber: users.operatorNumber,
        createdAt: users.createdAt,
      })
      .execute();

    if (createdUser) {
      // Adiciona uma linha na tabela `page_views` para o novo usuário com valores de data padrão
      await db
        .insert(pageViews)
        .values({
          userId: createdUser.id,
          pageExcel: new Date('1970-01-01T00:00:00Z'),
          pageDashboard: new Date('1970-01-01T00:00:00Z'),
          pageSalesQuote: new Date('1970-01-01T00:00:00Z'),
          lastViewedAt: new Date('1970-01-01T00:00:00Z'),
          lastUpdatedAt: new Date('1970-01-01T00:00:00Z'),
        })
        .execute();
    }

    return NextResponse.json({ users: createdUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 },
    );
  }
}
