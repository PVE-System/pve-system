'use client';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import {
  IconButton,
  InputAdornment,
  TextField,
  styled,
  useMediaQuery,
} from '@mui/material';

import TemporaryDrawer from '@/app/components/MenuNav/MenuNav';
import { FilterList } from '@mui/icons-material';

/* const CustomBox = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
}));
 */
export default function HeadApp() {
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 20,

            paddingBottom: 20,
          }}
        >
          <Box style={{ position: 'absolute', left: isSmallScreen ? 0 : 20 }}>
            <TemporaryDrawer />
          </Box>
          <TextField
            style={{ margin: 'auto', width: isSmallScreen ? '200px' : '300px' }}
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="filter">
                    <FilterList />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Container>
    </React.Fragment>
  );
}
