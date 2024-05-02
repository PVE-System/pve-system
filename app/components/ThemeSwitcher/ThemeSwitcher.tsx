/* 'use client';

import { ThemeProvider } from '@emotion/react';
import { Button } from '@mui/material';
import { useState, useEffect, ReactNode, useCallback } from 'react';

interface ThemeSwitcherProps {
  defaultTheme?: 'light' | 'dark';
  lightTheme?: object;
  darkTheme?: object;
  children: ReactNode;
  onThemeChange?: () => void; // Define a propriedade de alteração de tema como opcional
}

const ThemeSwitcher = ({
  defaultTheme = 'light',
  lightTheme = {},
  darkTheme = {},
  children,
  onThemeChange,
}: ThemeSwitcherProps) => {
  const [theme, setTheme] = useState(defaultTheme);

  // Salva o tema atual no localStorage
  const saveThemeToLocalStorage = (theme: string) => {
    localStorage.setItem('theme', theme);
    console.log('Theme saved to localStorage:', theme); // Registra o tema salvo no localStorage
  };

  // Recupera o tema armazenado no localStorage ou usa o tema padrão se não houver nada armazenado
  const getThemeFromLocalStorage = useCallback(() => {
    const storedTheme = localStorage.getItem('theme') || defaultTheme;
    console.log('Theme retrieved from localStorage:', storedTheme); // Registra o tema recuperado do localStorage
    return storedTheme;
  }, [defaultTheme]);

  // Atualiza o tema com base no valor armazenado no localStorage ao inicializar
  useEffect(() => {
    const storedTheme = getThemeFromLocalStorage();
    setTheme((storedTheme as 'light' | 'dark') || defaultTheme);
  }, [getThemeFromLocalStorage, defaultTheme]);

  // Altera o tema entre claro e escuro e salva no localStorage
  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveThemeToLocalStorage(newTheme);

    // Verifica se onThemeChange está definido antes de chamar a função de alteração de tema fornecida como prop
    if (onThemeChange) {
      onThemeChange();
    }
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <Button onClick={handleThemeChange}>
        {theme === 'dark' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
      </Button>
      {children}
    </ThemeProvider>
  );
};

export default ThemeSwitcher;
 */
