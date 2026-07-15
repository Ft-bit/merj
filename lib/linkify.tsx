import { ReactNode } from 'react'

// Turns any http(s) URL inside plain text into a clickable link,
// leaving all other text untouched. Used anywhere a user's bio is shown.
export function linkifyText(text: string, color: string): ReactNode[] {
  const urlPattern = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlPattern)
  // String.split with a capturing group returns matched URLs at odd
  // indices and plain text at even indices.
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color, textDecoration: 'none', wordBreak: 'break-all' }}
      >
        {part}
      </a>
    ) : part
  )
}
