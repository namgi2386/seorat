const { app, BrowserWindow, ipcMain, Menu, screen } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

const SIZES = {
  small:  { w: 70,  h: 105 },
  medium: { w: 130, h: 210 },
  large:  { w: 200, h: 320 },
};

let currentSize = 'large';
let win;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const { w, h } = SIZES[currentSize];

  const assetsPath = app.isPackaged
    ? path.join(process.resourcesPath, '3d-assets')
    : path.join(__dirname, '..', '3d-assets');

  process.env.ASSETS_BASE_URL = pathToFileURL(assetsPath).href;
  process.env.SCREEN_W = String(width);
  process.env.SCREEN_H = String(height);
  process.env.WIN_X = String(width - w - 20);
  process.env.WIN_Y = String(height - h - 20);

  const iconPath = app.isPackaged
    ? path.join(__dirname, 'icon.png')
    : path.join(__dirname, '..', 'icon.png');

  win = new BrowserWindow({
    width: w,
    height: h,
    x: width - w - 20,
    y: height - h - 20,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('index.html');
}

function changeSize(size) {
  currentSize = size;
  const { w, h } = SIZES[size];
  win.setSize(w, h);
  win.webContents.send('size-changed', w, h);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());

ipcMain.on('set-window-pos', (_e, x, y) => {
  win.setPosition(Math.round(x), Math.round(y));
});

ipcMain.handle('get-window-pos', () => win.getPosition());

ipcMain.on('show-context-menu', () => {
  Menu.buildFromTemplate([
    {
      label: '크기',
      submenu: [
        { label: '작게',  type: 'radio', checked: currentSize === 'small',  click: () => changeSize('small')  },
        { label: '중간',  type: 'radio', checked: currentSize === 'medium', click: () => changeSize('medium') },
        { label: '크게',  type: 'radio', checked: currentSize === 'large',  click: () => changeSize('large')  },
      ],
    },
    { type: 'separator' },
    { label: '종료', click: () => app.quit() },
  ]).popup({ window: win });
});
