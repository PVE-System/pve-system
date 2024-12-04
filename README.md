<h1>PVE System.</h1>

<h2>🐱‍👤Features:</h2>

- Client management system built with Next.js.
- Hosted on Vercel, and utilizing Vercel services for db and local storage.
- This project is currently under development.

<h2>🤖Tech:</h2>

![HTML](https://img.shields.io/badge/-HTML-05122A?style=flat&color=blue&logo=HTML5)
![CSS](https://img.shields.io/badge/-CSS-05122A?style=flat&color=blue&logo=CSS3)

![NEXTJS](https://img.shields.io/badge/-NextJS-05122A?style=flat&color=grey&logo=nextdotjs)
![NEXTJS](https://img.shields.io/badge/-Material.UI-05122A?style=flat&color=pink&logo=mui)

![TYPESCRIPT](https://img.shields.io/badge/-typeScript-05122A?style=flat&color=9cf&logo=TYPESCRIPT)
![NODEJS](https://img.shields.io/badge/-nodeJS-05122A?style=flat&color=9cf&logo=node.js)

![POSTGRESQL](https://img.shields.io/badge/-PostgreSql-05122A?style=flat&color=red&logo=POSTGRESQL)
![POSTGRESQL](https://img.shields.io/badge/-VERCEL-05122A?style=flat&color=darkblue&logo=vercel)

<h2>📁Project Structure:</h2>

### FrontEnd

The project follows a modular organization to ensure maintainability and scalability:

- `app/`: Contains pages that render components modularly.

All pages in the project are located directly under the app/ folder, following the latest Next.js routing structure.

Example: The main client page is implemented in `app/ClientPage/page.tsx` and uses components like ClientPageTabInfos.

- `app/components/`: Contains reusable frontend components.

Each component is responsible for managing its own logic, API calls, and rendering the frontend.

Example: `app/components/ClientPageTabInfos/ClientPageTabInfos.tsx` is responsible for rendering client information and making related API calls.

- Styles: Styling is applied within the same folder as the component using a file named styles.ts.

Example: The styles for the ClientPageTabInfos component are defined in `app/components/ClientPageTabInfos/styles.ts`.

### BackEnd

- `app/api/`: Contains all backend logic and API endpoints, following the Next.js structure.

Example: The /api/getClient route is implemented in `app/api/getClient/route.ts`.

## Database setup

The project uses Drizzle ORM for database management with PostgreSQL, offering an approach with efficient migrations, schema definitions and queries.
This ensures that database operations are reliable, easy to maintain, and in line with TypeScript's strong typing.

Spin up the database with:

```bash
npm run db:up
```

Spin down the database with:

```bash
npm run db:down
```

### Migrations

Generate the database migration based on the schema changes:

```bash
npm run db:generate -- --name <migration-name>
```

Run the migrations with:

```bash
npm run db:migrate
```

<h3>🐱‍🏍All rights reserved. © 2024 - PVE Representações Ltda.🐱‍🏍</h3>
