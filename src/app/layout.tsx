import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AdminMenuButton from "@/components/ui/navigation/AdminMenuButton";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Company WebApp",
  description: "Next.js Full-Stack Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* Admin Menu Button - Available on ALL pages */}
          <AdminMenuButton />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
