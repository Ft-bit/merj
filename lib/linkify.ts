import { createElement, ReactNode } from 'react'

// Turns any http(s) URL inside plain text into a clickable link,
// leaving all other text untouched. Written with createElement instead
// of JSX so this file has zero JSX syntax to parse — sidesteps any
// JSX-parsing quirk entirely, regardless of file extension.
export function linkifyText(text: string, color: string): ReactNode[] {
  const urlPattern = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlPattern)
  return parts.map((part, i) =>
    i % 2 === 1
      ? createElement(
          'a',
          {
            key: i,
            href: part,
            target: '_blank',
            rel: 'noopener noreferrer',
            style: { color, textDecoration: 'none', wordBreak: 'break-all' },
          },
          part
        )
      : part
  )
}
