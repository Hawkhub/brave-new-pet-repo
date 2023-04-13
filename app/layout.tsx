import Link from 'next/link';
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
        <main>
          {/* Nav should be here */}
          {children}
        </main>
      </body>
    </html>
  );
}
