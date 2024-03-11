import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { TextField } from '@mui/material'

export default function HeadApp() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingY: 1,
          }}
        >
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </Box>
      </Container>
    </React.Fragment>
  )
}

// container vazio que ocupa a tela inteira
// input de search com filtro
