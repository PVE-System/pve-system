'use client';

import { useTheme } from './ThemeContext';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { darkTheme, lightTheme } from '@/app/theme';

export function ThemedComponent(props: { children: React.ReactNode }) {
  const { theme } = useTheme();

  const muiTheme = theme === 'light' ? lightTheme : darkTheme;

  return <MUIThemeProvider theme={muiTheme}>{props.children}</MUIThemeProvider>;
}
