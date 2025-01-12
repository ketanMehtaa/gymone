'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import { ErrorBoundary } from '@/lib/bugsnag';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GymOne - Gym Management System',
  description: 'Manage your gym efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader color="#2563eb" />
            {children}
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
