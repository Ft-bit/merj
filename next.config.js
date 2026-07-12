/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allows Firebase's signInWithPopup to detect when the Google sign-in
  // popup window closes. Without this, Vercel/Next.js's default
  // Cross-Origin-Opener-Policy header blocks that detection, causing
  // popup sign-in to hang or report a generic failure.
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
