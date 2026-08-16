import { AuthProvider } from '../context/AuthContext'
import { ThemeProvider } from '../context/ThemeContext'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <style>{`
          [data-theme="dark"]{
            --bg-primary:#000;
            --bg-card:#0a0a0a;
            --bg-elevated:#0d0d0d;
            --bg-input:rgba(255,255,255,.035);
            --text-primary:#fff;
            --text-secondary:rgba(255,255,255,.55);
            --text-tertiary:rgba(255,255,255,.35);
            --border-color:rgba(255,255,255,.07);
            --border-color-strong:rgba(255,255,255,.12);
          }
          [data-theme="light"]{
            --bg-primary:#f7f7f8;
            --bg-card:#ffffff;
            --bg-elevated:#ffffff;
            --bg-input:rgba(0,0,0,.03);
            --text-primary:#0a0a0a;
            --text-secondary:rgba(0,0,0,.55);
            --text-tertiary:rgba(0,0,0,.4);
            --border-color:rgba(0,0,0,.08);
            --border-color-strong:rgba(0,0,0,.14);
          }
          body{ background:var(--bg-primary); color:var(--text-primary); }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
