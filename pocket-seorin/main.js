const { app, BrowserWindow, ipcMain, Menu, screen } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

const WIN_W = 70;
const WIN_H = 105;

let win;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const assetsPath = app.isPackaged
    ? path.join(process.resourcesPath, '3d-assets')
    : path.join(__dirname, '..', '3d-assets');

  process.env.ASSETS_BASE_URL = pathToFileURL(assetsPath).href;
  process.env.SCREEN_W = String(width);
  process.env.SCREEN_H = String(height);
  process.env.WIN_X = String(width - WIN_W - 20);
  process.env.WIN_Y = String(height - WIN_H - 20);

  win = new BrowserWindow({
    width: WIN_W,
    height: WIN_H,
    x: width - WIN_W - 20,
    y: height - WIN_H - 20,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());

ipcMain.on('set-window-pos', (_e, x, y) => {
  win.setPosition(Math.round(x), Math.round(y));
});

ipcMain.on('show-context-menu', () => {
  Menu.buildFromTemplate([
    { label: '종료', click: () => app.quit() },
  ]).popup({ window: win });
});
