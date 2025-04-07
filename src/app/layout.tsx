import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import ThemeRegistry from '@/components/ThemeRegistry';
import Header from '@/components/Header';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Courtcase - Defense Lawyer Case Management',
  description: 'Defense Lawyer Case Management System',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Providers>
            <AuthProvider>
              <Header />
              {children}
            </AuthProvider>
          </Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
