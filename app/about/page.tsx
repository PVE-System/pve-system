import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NextLink from 'next/link';

import ClientProfile from '../components/ProfileClient/ProfileClient';
import { db } from '../db';
import { clients } from '../db/schema';

export default async function About() {
  const result = await db.select().from(clients);
  /* const resultTeam = await db.select().from(clients); */
  // const result2 = await db.query.users.findMany();

  // const newUser = {
  //   fullName: 'User ' + Math.floor(Math.random() * 1000),
  // };
  // await db.insert(users).values({ fullName: newUser.fullName });

  return (
    <Container maxWidth="lg">
      <pre>{JSON.stringify(result, null, 2)}</pre>
      {/* <pre>{JSON.stringify(resultTeam, null, 2)}</pre> */}
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ClientProfile
          rating={0}
          clientCondition={''}
          setRating={function (rating: number): void {
            throw new Error('Function not implemented.');
          }}
          setClientCondition={function (condition: string): void {
            throw new Error('Function not implemented.');
          }}
        />
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material UI - Next.js example in TypeScript
        </Typography>
        <Box sx={{ maxWidth: 'sm' }}>
          <Button variant="contained" component={NextLink} href="/">
            Trocar de Tema
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
