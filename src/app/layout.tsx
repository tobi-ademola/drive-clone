import type React from "react";
import "~/styles/globals.css";
import "@uploadthing/react/styles.css";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "./_providers/posthog-provider";

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-zinc-900 text-zinc-100">
          {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}> */}
          <PostHogProvider>{children}</PostHogProvider>
          {/* </ThemeProvider> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
