import * as React from 'react'
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
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            DashBoard - Conteudo do Dashboard
          </Typography>
          <Box sx={{ maxWidth: 'sm' }}>
            <Button variant="contained" component={NextLink} href="/">
              Go to the home page
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  )
}
