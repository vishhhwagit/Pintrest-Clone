import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pinverse — Discover ideas',
  description: 'A Pinterest-inspired app to discover, save, and share visual content',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="mx-auto min-h-screen max-w-7xl px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
