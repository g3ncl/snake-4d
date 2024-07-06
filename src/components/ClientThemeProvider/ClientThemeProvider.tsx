"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useState, useEffect } from "react";

const ClientThemeProvider = ({
  children,
  ...props
}: ThemeProviderProps): JSX.Element => {
  const [mounted, setMounted] = useState(false);
  const [defaultTheme, setDefaultTheme] = useState("system");

  useEffect(() => {
    setMounted(true);
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDefaultTheme(savedTheme);
    }
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider {...props} defaultTheme={defaultTheme}>
      {children}
    </NextThemesProvider>
  );
};

export default ClientThemeProvider;
