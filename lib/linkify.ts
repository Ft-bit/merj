import { ReactNode } from 'react'

// Turns any http(s) URL inside plain text into a clickable link. The hre
// keeps the full original URL (so it navigates correctly), but the VISIBLE
// text strips the protocol and trailing slash — so a bio showing
// "https://vemzomart.com/" displays as just "vemzomart.com" instead of the
// long, technical-looking full address.
export function linkifyText(text: string, color: string): ReactNode[] {
  const urlPattern = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlPattern)
  return parts.map((part, i) => {
    if (i % 2 !== 1) return part
    const display = part.replace(/^https?:\/\//, '').replace(/\/$/, '')
    return (
      
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color, textDecoration: 'none', wordBreak: 'break-all' }}
      >
        {display}
      </a>
    )
  })
}
