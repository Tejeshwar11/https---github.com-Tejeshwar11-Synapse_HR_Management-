import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Synapse: Your Workplace, Understood.',
  description: 'Leverage predictive AI to understand your workforce, prevent attrition, and build a more engaged team.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex flex-col min-h-screen bg-background">
          <main className="flex-grow">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
