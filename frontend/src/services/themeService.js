const THEME_KEY = "stockflow-theme";

export const getTheme = () => {
  return localStorage.getItem(THEME_KEY) || "light";
};

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const initializeTheme = () => {
  const theme = getTheme();

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};