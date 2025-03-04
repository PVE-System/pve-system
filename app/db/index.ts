export { db } from './db';
export { users, clients, businessGroups } from './schema'; /*Tabelas*/
export type {
  User,
  NewUser,
  Client,
  NewClient,
  BusinessGroup,
  NewBusinessGroup,
} from './schema'; /*Tipos inferidos para ser importados*/
