import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SessionBar } from './SessionBar'

const App: React.FC = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const [busy, setBusy] = useState(false)

  const [session, setSession] = useState<{ id: string; port: number } | null>(null)
  const serverBase = useMemo(() => `http://127.0.0.1:${session?.port || '8000'}`, [session])

  async function send() {
    if (!input.trim() || busy) return
    setBusy(true)
    setMessages((m) => [...m, `> ${input}`])

    try {
      const resp = await fetch(`${serverBase}/openai/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: input }],
          stream: true
        })
      })
      const reader = resp.body?.getReader()
      const decoder = new TextDecoder()
      let buf = ''
      if (!reader) throw new Error('No stream')
      let assistantLine = ''
      setMessages((m) => [...m, ''])
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        // SSE: lines starting with "data:"
        const parts = buf.split('\n\n')
        for (let i = 0; i < parts.length - 1; i++) {
          const line = parts[i].trim()
          if (line.startsWith('data:')) {
            try {
              const payload = JSON.parse(line.slice(5).trim())
              const delta = payload.choices?.[0]?.delta?.content || ''
              if (delta) {
                assistantLine += delta
                setMessages((m) => {
                  const copy = [...m]
                  copy[copy.length - 1] = assistantLine
                  return copy
                })
              }
            } catch {}
          }
        }
        buf = parts[parts.length - 1]
      }
    } catch (e: any) {
      setMessages((m) => [...m, `Error: ${e?.message || e}`])
    } finally {
      setBusy(false)
      setInput('')
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const s = await (window as any).electronAPI?.getSession?.()
        if (s) setSession(s)
      } catch {}
    })()
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <strong>Open Interpreter</strong>
        <SessionBar current={session} onSelect={(s) => setSession(s)} />
      </header>
      <main style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        {messages.map((m, i) => (
          <pre key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{m}</pre>
        ))}
      </main>
      <footer style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #eee' }}>
        <input
          style={{ flex: 1, padding: 8 }}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
        />
        <button onClick={send} disabled={busy}>Send</button>
      </footer>
    </div>
  )
}

export default App