import { createElement, ReactNode } from 'react'

// Turns any http(s) URL inside plain text into a clickable link. The href
// keeps the full original URL (so it navigates correctly), but the VISIBLE
// text strips the protocol and trailing slash. Written with createElement
// instead of JSX so this file has zero JSX syntax — this sidesteps the
// extension issue entirely (a .ts file containing <a> tags fails to parse
// regardless of what the extension says, since Next.js only enables JSX
// parsing for .tsx files).
export function linkifyText(text: string, color: string): ReactNode[] {
  const urlPattern = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlPattern)
  return parts.map((part, i) => {
    if (i % 2 !== 1) return part
    const display = part.replace(/^https?:\/\//, '').replace(/\/$/, '')
    return createElement(
      'a',
      {
        key: i,
        href: part,
        target: '_blank',
        rel: 'noopener noreferrer',
        style: { color, textDecoration: 'none', wordBreak: 'break-all' },
      },
      display
    )
  })
}
