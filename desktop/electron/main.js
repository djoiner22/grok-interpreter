import { app, BrowserWindow, dialog } from 'electron'
import { spawn } from 'child_process'
import path from 'node:path'
import getPort from 'get-port'
import os from 'os'

let mainWindow = null
let pyProc = null
let serverPort = 8000

async function startPythonServer() {
  try {
    serverPort = process.env.INTERPRETER_PORT ? Number(process.env.INTERPRETER_PORT) : await getPort({ port: getPort.makeRange(8000, 8100) })

    const env = { ...process.env, INTERPRETER_HOST: '127.0.0.1', INTERPRETER_PORT: String(serverPort) }

    // Prefer running within user's environment; assume "interpreter" available on PATH
    const cmd = 'interpreter'
    const args = ['--server']

    pyProc = spawn(cmd, args, { env, stdio: 'pipe' })

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
    const ok = await waitFor(`http://127.0.0.1:${serverPort}/heartbeat`, 20000)
    if (!ok) throw new Error('Interpreter server failed to start')
  } catch (e) {
    console.error(e)
    dialog.showErrorBox('Failed to start Open Interpreter', String(e))
    app.quit()
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
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const isDev = process.env.ELECTRON_START_URL
  if (isDev) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', async () => {
  // Ensure Python server is running
  await startPythonServer()
  // Vite dev server URL for renderer during development
  if (process.env.NODE_ENV !== 'production') {
    process.env.ELECTRON_START_URL = `http://localhost:5173`
  }
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (pyProc) {
      try { pyProc.kill() } catch {}
      pyProc = null
    }
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})