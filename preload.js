import { contextBridge, ipcRenderer } from 'electron';

// Expose ipcRenderer methods securely to the renderer process
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
  },
});

// Log to verify if preload script is being executed
console.log('Preload script loaded successfully.');
