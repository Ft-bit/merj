import { AuthProvider } from '../context/AuthContext'

// FIX: this project has never had a viewport meta tag. Without it, mobile
// browsers assume a ~980px desktop-width canvas and shrink the entire page
// to fit the screen — which is the real reason the site has looked "fine
// on PC but wrong on mobile" this whole time: every avatar, every layout,
// every touch target was being rendered at desktop size then scaled down,
// not actually laid out for a phone screen.
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
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#000', color: '#fff' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
