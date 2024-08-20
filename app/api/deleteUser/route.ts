//api/getUser/[id]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { db, users, User, NewUser } from '@/app/db';
import { eq } from 'drizzle-orm';

//METODO DELETE:

export async function DELETE(request: NextRequest) {
  const userToDelete = await request.json();
  const deleteUser = await db
    .delete(users)
    .where(eq(users.id, userToDelete.id))
    .returning({
      id: users.id,
      email: users.email,
      password: users.password,
      name: users.name,
      createdAt: users.createdAt,
    });
  return NextResponse.json({ users: deleteUser });
}
