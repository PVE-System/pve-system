import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';

import { ThemeProvider, ThemedComponent } from '@/app/theme';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <ThemedComponent>{props.children}</ThemedComponent>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
