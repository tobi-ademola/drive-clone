import type React from "react";
import "~/styles/globals.css";
import DriveLayout from "~/components/drive-layout";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["200", "400", "600", "800"],
  subsets: ["latin"],
});

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
    <html lang="en" suppressHydrationWarning className={poppins.className}>
      <body className="min-h-screen bg-zinc-900 text-zinc-100">
        <DriveLayout>{children}</DriveLayout>
      </body>
    </html>
  );
}
