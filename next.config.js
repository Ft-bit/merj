/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // FIX: Next.js/Vercel's default Cross-Origin-Opener-Policy header blocks
  // Firebase's signInWithPopup from detecting when the Google sign-in popup
  // closes, causing it to fail/hang. This header override allows popups
  // to communicate with the opener window while still being reasonably secure.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
