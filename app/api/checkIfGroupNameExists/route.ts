// pages/api/checkIfGroupNameExists.ts
import { db } from '@/app/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { name } = req.query; // Extrai o parâmetro "name" da query string

  if (!name) {
    return res.status(400).json({ error: 'Nome não fornecido' });
  }

  try {
    // Verifica se o nome já existe no banco de dados
    const group = await db.query.businessGroups.findFirst({
      where: (group, { eq }) => eq(group.name, name as string),
    });

    // Retorna true se o nome já existir, false caso contrário
    res.status(200).json({ exists: !!group });
  } catch (error) {
    console.error('Erro ao verificar nome do grupo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
