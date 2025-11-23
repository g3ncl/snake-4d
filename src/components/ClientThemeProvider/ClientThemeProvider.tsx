"use client";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import React, { useState, useEffect } from "react";

const ClientThemeProvider = ({
  children,
  ...props
}: ThemeProviderProps): React.JSX.Element => {
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
