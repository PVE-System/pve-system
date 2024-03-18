import * as React from 'react'
import '@/app/styles/globals.css'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import NextLink from 'next/link'
import HeadApp from '@/app/components/HeadApp/HeadApp'

export default function Dashboard() {
  return (
    <>
      <HeadApp />
      <Container fixed>
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
  )
}
