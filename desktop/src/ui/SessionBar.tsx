import React, { useEffect, useState } from 'react'

type Session = { id: string; port: number }

declare global {
  interface Window {
    electronAPI?: {
      listSessions: () => Promise<Session[]>
      newSession: (opts?: any) => Promise<Session>
      getSession: () => Promise<Session | null>
    }
  }
}

export const SessionBar: React.FC<{ onSelect: (s: Session) => void; current?: Session | null }> = ({ onSelect, current }) => {
  const [sessions, setSessions] = useState<Session[]>([])

  async function refresh() {
    const s = await window.electronAPI?.listSessions?.()
    setSessions(s || [])
  }

  useEffect(() => { refresh() }, [])

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button onClick={async () => { const s = await window.electronAPI?.newSession?.({}); await refresh(); if (s) onSelect(s) }}>+ New</button>
      {sessions.map((s) => (
        <button key={s.id} onClick={() => onSelect(s)} style={{ fontWeight: current?.id === s.id ? 'bold' : undefined }}>
          {s.id}@{s.port}
        </button>
      ))}
    </div>
  )
}