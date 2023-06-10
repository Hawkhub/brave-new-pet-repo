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
      <head></head>
      <body>
        <Header />
        <main>
          {/* Nav should be here */}
          {children}
        </main>
      </body>
    </html>
  );
}
