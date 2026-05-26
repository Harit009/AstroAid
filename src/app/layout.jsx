import Navigation from '../components/Navigation';
import './globals.css';

export const metadata = {
  title: 'AstroAid App',
  description: 'Explore the universe.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="text-[#FFFFFF] antialiased overflow-x-hidden min-h-screen" suppressHydrationWarning>
        <Navigation />
        <main className="w-full md:pl-[260px] pb-20 md:pb-0 relative z-0">
          {children}
        </main>
      </body>
    </html>
  );
}
