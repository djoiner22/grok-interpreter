import { app, BrowserWindow, dialog } from 'electron'
import { spawn } from 'child_process'
import path from 'node:path'
import getPort from 'get-port'
import os from 'os'

let mainWindow = null
const sessions = new Map() // id -> { window, pyProc, port }
let nextId = 1

function sessionId() {
  return String(nextId++)
}

async function startPythonServer() {
  try {
    const port = process.env.INTERPRETER_PORT ? Number(process.env.INTERPRETER_PORT) : await getPort({ port: getPort.makeRange(8000, 8100) })

    const env = { ...process.env, INTERPRETER_HOST: '127.0.0.1', INTERPRETER_PORT: String(port) }

    // Prefer running within user's environment; assume "interpreter" available on PATH
    const cmd = 'interpreter'
    const args = ['--server']

    const pyProc = spawn(cmd, args, { env, stdio: 'pipe' })

    pyProc.stdout.on('data', (d) => {
      const s = d.toString()
      if (process.env.DEBUG) process.stdout.write(`[py] ${s}`)
    })
    pyProc.stderr.on('data', (d) => {
      const s = d.toString()
      if (process.env.DEBUG) process.stderr.write(`[py-err] ${s}`)
    })
    pyProc.on('exit', (code) => {
      if (code !== 0) console.error('Python server exited with code', code)
    })

    // Wait until heartbeat responds
    const ok = await waitFor(`http://127.0.0.1:${port}/heartbeat`, 20000)
    if (!ok) throw new Error('Interpreter server failed to start')

    return { pyProc, port }
  } catch (e) {
    console.error(e)
    dialog.showErrorBox('Failed to start Open Interpreter', String(e))
    throw e
  }
}

async function waitFor(url, timeoutMs) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok) return true
    } catch {}
    await new Promise((r) => setTimeout(r, 300))
  }
  return false
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const isDev = process.env.ELECTRON_START_URL
  if (isDev) {
    win.loadURL(process.env.ELECTRON_START_URL)
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  win.on('closed', () => {
    const entry = Array.from(sessions.entries()).find(([, s]) => s.window === win)
    if (entry) {
      const [id, s] = entry
      try { s.pyProc?.kill() } catch {}
      sessions.delete(id)
    }
  })

  return win
}

async function createSessionWindow() {
  const { pyProc, port } = await startPythonServer()
  const win = createWindow()
  const id = sessionId()
  sessions.set(id, { window: win, pyProc, port })
  return { id, port }
}

import { ipcMain } from 'electron'

ipcMain.handle('session:new', async (_e, _opts) => {
  const s = await createSessionWindow()
  return s
})

ipcMain.handle('session:list', () => {
  return Array.from(sessions.entries()).map(([id, s]) => ({ id, port: s.port }))
})

ipcMain.handle('session:get', (_e) => {
  const focused = BrowserWindow.getFocusedWindow()
  const entry = Array.from(sessions.entries()).find(([, s]) => s.window === focused)
  if (!entry) return null
  const [id, s] = entry
  return { id, port: s.port }
})

ipcMain.handle('session:relay', (_e, { targetSessionId, content }) => {
  const target = sessions.get(String(targetSessionId))
  if (!target) return false
  target.window.webContents.send('session:external-message', { type: 'relay', content })
  return true
})

app.on('ready', async () => {
  if (process.env.NODE_ENV !== 'production') {
    process.env.ELECTRON_START_URL = `http://localhost:5173`
  }
  await createSessionWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    for (const [, s] of sessions) {
      try { s.pyProc?.kill() } catch {}
    }
    sessions.clear()
    app.quit()
  }
})

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createSessionWindow()
  }
})