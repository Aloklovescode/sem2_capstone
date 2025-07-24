import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { CryptoProvider } from '@/contexts/CryptoContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CryptoTracker - Advanced Cryptocurrency Trading Platform',
  description: 'Modern cryptocurrency tracking and trading platform with real-time market data, portfolio management, and advanced trading features.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <CryptoProvider>
              {children}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #333',
                  },
                }}
              />
            </CryptoProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}