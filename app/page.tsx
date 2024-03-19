'use client';

import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
/* import Link from '@mui/material/Link' */
import NextLink from 'next/link';
import { Button } from '@mui/material';

export default function Home() {
  return (
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 2, textAlign: 'center' }}
          >
            Home Login - Sistema de login no arquivo page.tsx principal.
          </Typography>
          <Button
            /* className="button-size" */
            variant="contained"
            component={NextLink}
            href="/dashboard"
          >
            <Typography variant="button" display="block">
              Go to the Dashboard
            </Typography>
          </Button>
          {/*           <Button variant="contained" component={NextLink} href="/about">
            Go to the about Page.
          </Button> */}
          {/* <Link href="/about" color="secondary" component={NextLink}>
      Go to the Dashboard Page
    </Link> */}
        </Box>
      </Container>
    </>
  );
}
