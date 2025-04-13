import type React from "react";
import "~/styles/globals.css";
// import { ThemeProvider } from "~/components/theme-provider"

export const metadata = {
  title: "Google Drive Clone",
  description: "A Google Drive clone UI built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-900 text-zinc-100">
        {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}> */}
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
