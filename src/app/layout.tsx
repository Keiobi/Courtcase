import { ReactNode } from 'react';
import { Metadata } from 'next';
import ThemeRegistry from '@/components/ThemeRegistry';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Courtcase - Defense Lawyer Case Management',
  description: 'Defense Lawyer Case Management System',
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
          <Header />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
