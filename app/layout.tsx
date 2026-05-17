import { AuthProvider } from '../context/AuthContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Merj — Buy & Sell Websites Safely</title>
        <meta name="description" content="Buy and sell WordPress, Blogger, and Vercel websites with full escrow protection." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%232563eb'/><text y='.9em' font-size='80' x='10'>M</text></svg>" />
      </head>
      <body style={{
        margin: 0,
        background: '#0a0a0a',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif'
      }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
