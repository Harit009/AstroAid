import DashboardShell from '../components/DashboardShell';
import './globals.css';

export const metadata = {
  title: 'AstroAid — Astronomical Intelligence',
  description: 'Real-time planetary science telemetry and deep-space monitoring dashboard powered by the NASA Open API.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="text-[#FFFFFF] antialiased overflow-x-hidden min-h-screen" suppressHydrationWarning>
        <DashboardShell>
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}
