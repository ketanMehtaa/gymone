'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import { ErrorBoundary } from '@/lib/bugsnag';
import { CSPostHogProvider } from './providers';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <CSPostHogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader color="#2563eb" />
              {children}
              <Toaster richColors position="top-center" />
            </ThemeProvider>
          </CSPostHogProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
