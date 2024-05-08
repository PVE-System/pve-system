'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import { ThemeProvider as RootThemeProvider } from '@/app/theme';
import { ThemeProvider } from '@/app/theme/ThemeContext'; // Importe o ThemeProvider
import { getThemeFromCookie, setThemeCookie } from '@/app/theme/themeCookies';

import { ThemedComponent } from '@/app/theme';

export default function RootLayout(props: { children: React.ReactNode }) {
  // Inicialize o tema com o valor do cookie
  const initialTheme = getThemeFromCookie() || 'light';

  // Estado para armazenar o tema atual
  const [theme, setTheme] = React.useState<string>(initialTheme);

  // Função para alternar o tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setThemeCookie(newTheme); // Atualize o cookie ao alternar o tema
  };

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          {/* Envolve o conteúdo com o ThemeProvider */}
          <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
            {/* Envolve o conteúdo com o RootThemeProvider */}
            <RootThemeProvider theme={theme} toggleTheme={toggleTheme}>
              <CssBaseline />
              <ThemedComponent>{props.children}</ThemedComponent>
            </RootThemeProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
