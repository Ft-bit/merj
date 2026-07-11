/** @type {import('next').NextConfig} */
const nextConfig = {
  // FIX: these were both `true`, which silently hides real TypeScript and
  // ESLint errors at build time. That's a common reason bugs make it to
  // production without you seeing any warning. Turn them back on once your
  // codebase is clean; if a specific rule is too noisy, disable that rule
  // in .eslintrc.json instead of suppressing everything.
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
