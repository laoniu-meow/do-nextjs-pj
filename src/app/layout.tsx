import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Company WebApp",
    default: "Company WebApp - Next.js Full-Stack Application",
  },
  description:
    "A secure and optimized Next.js application with PostgreSQL backend",
  keywords: ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma"],
  authors: [{ name: "Company WebApp Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">{children}</div>
      </body>
    </html>
  );
}
