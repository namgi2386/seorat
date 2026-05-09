const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  assetsBaseUrl: process.env.ASSETS_BASE_URL,
  moveWindow: (dx, dy) => ipcRenderer.send('move-window', dx, dy),
  showContextMenu: () => ipcRenderer.send('show-context-menu'),
});
