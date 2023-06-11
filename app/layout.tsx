import Link from 'next/link';
import { Header } from 'src/widgets/Header';
import './globals.css';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="192x192"/>
        <link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="180x180"/>
      </head>
      <body>
        <Header />
        <main>
          {/* Nav should be here */}
          {children}
        </main>
      </body>
    </html>
  );
};
