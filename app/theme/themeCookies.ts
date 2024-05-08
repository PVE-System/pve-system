export const getThemeFromCookie = () => {
  // Obtém o tema do cookie
  const themeCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('theme='));
  if (themeCookie) {
    return themeCookie.split('=')[1];
  }
  return undefined;
};

export const setThemeCookie = (theme: string) => {
  // Define o cookie com o tema selecionado
  document.cookie = `theme=${theme}; path=/; max-age=31536000`;
};
