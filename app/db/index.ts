export { db } from './db';
export {
  users,
  clients,
  businessGroups,
  visitRoutes,
  visitRouteClients,
} from './schema'; /*Tabelas*/
export type {
  User,
  NewUser,
  Client,
  NewClient,
  BusinessGroup,
  NewBusinessGroup,
  VisitRoute,
  NewVisitRoute,
  VisitRouteClient,
  NewVisitRouteClient,
} from './schema'; /*Tipos inferidos para ser importados*/
