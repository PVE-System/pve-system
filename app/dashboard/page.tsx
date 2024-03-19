import * as React from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import HeadApp from '@/app/components/HeadApp/HeadApp';
import styles from '@/app/dashboard/styles';

export default function Dashboard() {
  return (
    <>
      <HeadApp />
      <Container fixed>
        <Box sx={styles.container}>
          <Typography variant="h4" component="h1">
            DashBoard - Conteudo do Dashboard
          </Typography>
          <Box sx={{ maxWidth: 'sm' }}>
            <Button
              /* className="button-size" */
              variant="contained"
              component={NextLink}
              href="/"
            >
              <Typography variant="button" display="block">
                Go to the home page
              </Typography>
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
