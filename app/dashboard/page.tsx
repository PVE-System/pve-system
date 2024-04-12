import * as React from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NextLink from 'next/link';

import HeadApp from '../components/HeadApp/HeadApp';
import DashboardComponent from '../components/Dashboard/Dashboard';

import sharedStyles from '@/app/styles/sharedStyles';

export default function Dashboard() {
  return (
    <>
      <HeadApp />
      <Container fixed>
        <Box sx={sharedStyles.container}>
          <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
            <span>Dash</span>Board
          </Typography>
          <Box sx={{ maxWidth: 'sm' }}></Box>
        </Box>
        <DashboardComponent />
      </Container>
    </>
  );
}
