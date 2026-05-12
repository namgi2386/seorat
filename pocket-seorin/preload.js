const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  assetsBaseUrl: process.env.ASSETS_BASE_URL,
  screenW: parseInt(process.env.SCREEN_W),
  screenH: parseInt(process.env.SCREEN_H),
  initX: parseInt(process.env.WIN_X),
  initY: parseInt(process.env.WIN_Y),
  setWindowPos: (x, y) => ipcRenderer.send('set-window-pos', x, y),
  getWindowPos: () => ipcRenderer.invoke('get-window-pos'),
  showContextMenu: () => ipcRenderer.send('show-context-menu'),
  onSizeChanged: (cb) => ipcRenderer.on('size-changed', (_e, w, h) => cb(w, h)),
});
