import { AuthProvider } from '../context/AuthContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Merj — Buy & Sell Websites</title>
        <meta name="description" content="Buy and sell WordPress, Blogger, and Vercel websites with automated ownership transfer." />
      </head>
      <body style={{ margin: 0, background: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
