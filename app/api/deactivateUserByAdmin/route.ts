import { NextResponse, NextRequest } from 'next/server';
import { db, users } from '@/app/db';
import { eq } from 'drizzle-orm';

export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'User ID is required and must be valid' },
        { status: 400 },
      );
    }

    // Verificar se o usuário existe
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)))
      .execute();

    if (userExists.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Extrair o nome do usuário e garantir que não seja nulo ou indefinido
    const userName = userExists[0].name ?? 'user'; // Se userName for nulo ou indefinido, usar 'user' como valor padrão

    // Formatar o nome do usuário: remover espaços, caracteres especiais e converter para minúsculas
    const formattedName = userName
      .toLowerCase()
      .replace(/\s+/g, '_') // Substitui espaços por _
      .replace(/[^a-z0-9_]/g, ''); // Remove caracteres especiais

    // Gerar e-mail fictício baseado no nome e ID do usuário
    const fakeEmail = `colaborador_${formattedName}_id_${id}@fakeemail.com`;

    // Atualizar o campo is_active para false, o e-mail e remover a senha
    await db
      .update(users)
      .set({ is_active: false, email: fakeEmail, password: '' })
      .where(eq(users.id, Number(id)))
      .execute();

    return NextResponse.json({
      message: 'User deactivated, email and password updated successfully',
    });
  } catch (error) {
    console.error(
      'Error deactivating user and updating email/password:',
      error,
    );
    return NextResponse.json(
      { error: 'Failed to deactivate user and update email/password' },
      { status: 500 },
    );
  }
}
