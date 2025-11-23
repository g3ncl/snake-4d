import type { Metadata } from "next";
import ClientThemeProvider from "@/components/ClientThemeProvider/ClientThemeProvider";
import { SettingsProvider } from "@/context/SettingsContext";

import "./globals.scss";
import localFont from "next/font/local";

const iosevka = localFont({
  src: [
    {
      path: "./fonts/Iosevka-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});
export const metadata: Metadata = {
  title: "Snake 4D",
  description: "Play Snake 4D",
};

// eslint-disable-next-line func-style, prefer-arrow/prefer-arrow-functions
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={iosevka.className}>
        <SettingsProvider>
          <ClientThemeProvider enableSystem defaultTheme="system">
            {children}
          </ClientThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
