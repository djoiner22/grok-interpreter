import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getSession: () => ipcRenderer.invoke('session:get'),
  listSessions: () => ipcRenderer.invoke('session:list'),
  newSession: (opts) => ipcRenderer.invoke('session:new', opts),
  relayTo: (targetSessionId, content) => ipcRenderer.invoke('session:relay', { targetSessionId, content }),
  onExternalMessage: (cb) => {
    const listener = (_e, payload) => cb(payload)
    ipcRenderer.on('session:external-message', listener)
    return () => ipcRenderer.removeListener('session:external-message', listener)
  }
})