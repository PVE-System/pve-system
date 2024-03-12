'use client'
import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { TextField, useMediaQuery } from '@mui/material'

import TemporaryDrawer from '@/app/components/MenuNav/MenuNav'

export default function HeadApp() {
  const textFieldSmallScreen = useMediaQuery('(max-width:600px)')
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingY: 2,
            position: 'relative', // Adicionando para posicionar os itens corretamente
          }}
        >
          <Box
            sx={{
              marginLeft: textFieldSmallScreen ? '20%' : '0%',
            }}
          >
            <TextField
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
            />
          </Box>
          <Box sx={{ position: 'absolute', left: 0 }}>
            <TemporaryDrawer />{' '}
            {/* Aqui estou trazendo o botao do MenuNav para dentro do container HeadApp e deixando ele na lateral esquerda */}
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  )
}
