import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { toZonedTime, format } from 'date-fns-tz'

export type TZOption = 'America/Mexico_City' | 'America/New_York'

const TZ_LABELS: Record<TZOption, string> = {
  'America/Mexico_City': 'CT',
  'America/New_York': 'ET',
}

const TZ_DISPLAY: Record<TZOption, string> = {
  'America/Mexico_City': 'México',
  'America/New_York': 'New York',
}

const STORAGE_KEY = 'wc26_tz'

function loadSaved(): TZOption {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'America/Mexico_City' || saved === 'America/New_York') return saved
  return 'America/Mexico_City'
}

interface TZContext {
  zone: TZOption
  label: string
  displayName: string
  setZone: (z: TZOption) => void
  formatTime: (utcMs: number) => string
}

const Ctx = createContext<TZContext | null>(null)

export function TimezoneProvider({ children }: { children: ReactNode }) {
  const [zone, setZoneState] = useState<TZOption>(loadSaved)

  function setZone(z: TZOption) {
    setZoneState(z)
    localStorage.setItem(STORAGE_KEY, z)
  }

  function formatTime(utcMs: number): string {
    const dt = toZonedTime(new Date(utcMs), zone)
    return format(dt, 'HH:mm', { timeZone: zone })
  }

  return (
    <Ctx.Provider value={{ zone, label: TZ_LABELS[zone], displayName: TZ_DISPLAY[zone], setZone, formatTime }}>
      {children}
    </Ctx.Provider>
  )
}

export function useTimezone(): TZContext {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTimezone must be inside TimezoneProvider')
  return ctx
}

export { TZ_LABELS, TZ_DISPLAY }
