import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import { ThemeProvider, ThemedComponent } from '@/app/theme';
import { AuthProvider } from '@/app/contex/authContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import '../app/styles/globals.css';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider>
            <AuthProvider>
              <CssBaseline />
              <ThemedComponent>
                <ProtectedRoute route="/">{props.children}</ProtectedRoute>
              </ThemedComponent>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
