import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Al Ain Heritage Developments | Villa Redevelopment Specialists',
  description: 'Transforming Al Ain\'s traditional villas into modern apartment living. Over 30 years of trusted property development experience in the UAE.',
  keywords: 'Al Ain, villa redevelopment, property development, UAE, apartments, construction, renovation',
  openGraph: {
    title: 'Al Ain Heritage Developments',
    description: 'Transforming Al Ain, One Villa at a Time',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
