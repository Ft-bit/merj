'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (t: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('merj-theme') as ThemeMode | null
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setThemeState(stored)
    }
  }, [])

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const resolve = () => {
      const actual: ResolvedTheme = theme === 'system' ? (mql.matches ? 'dark' : 'light') : theme
      setResolvedTheme(actual)
      document.documentElement.setAttribute('data-theme', actual)
    }
    resolve()
    mql.addEventListener('change', resolve)
    return () => mql.removeEventListener('change', resolve)
  }, [theme])

  const setTheme = (t: ThemeMode) => {
    setThemeState(t)
    localStorage.setItem('merj-theme', t)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
