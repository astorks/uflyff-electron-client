import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import * as path from "path";



function createWindow() {
  // Create the browser window.
  const wnd = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.join(__dirname, "../img/favicon.png"),
    titleBarStyle: 'hidden',

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webviewTag: true,
    },
  });

  wnd.setWindowButtonVisibility(false);
  wnd.loadFile(path.join(__dirname, "../index.html"));
//   wnd.webContents.openDevTools();
  return wnd;
}

let flyffipediaWindow: BrowserWindow = null;
function windowShowFlyffipedia() {
    if(flyffipediaWindow && !flyffipediaWindow.isDestroyed()) {
        flyffipediaWindow.show();
        return;
    }

    // Create the browser window.
    flyffipediaWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: path.join(__dirname, "../img/favicon-flyffipedia.png"),
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            webviewTag: true,
        },
    });

    flyffipediaWindow.setWindowButtonVisibility(false);
    flyffipediaWindow.loadFile(path.join(__dirname, "../flyffipedia.html"));
}


let madrigalinsideWindow: BrowserWindow = null;
function windowShowMadrigalinside() {
    if(madrigalinsideWindow && !madrigalinsideWindow.isDestroyed()) {
        madrigalinsideWindow.show();
        return;
    }

    // Create the browser window.
    madrigalinsideWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: path.join(__dirname, "../img/favicon-madrigalinside.png"),
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            webviewTag: true,
        },
    });

    madrigalinsideWindow.setWindowButtonVisibility(false);
    madrigalinsideWindow.loadFile(path.join(__dirname, "../madrigalinside.html"));
}

let flyffulatorWindow: BrowserWindow = null;
function windowShowFlyffulator() {
    if(flyffulatorWindow && !flyffulatorWindow.isDestroyed()) {
        flyffulatorWindow.show();
        return;
    }

    // Create the browser window.
    flyffulatorWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: path.join(__dirname, "../img/favicon-flyffulator.png"),
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            webviewTag: true,
        },
    });

    flyffulatorWindow.setWindowButtonVisibility(false);
    flyffulatorWindow.loadFile(path.join(__dirname, "../flyffulator.html"));
}

let madrigalmapsWindow: BrowserWindow = null;
function windowShowMadrigalmaps() {
    if(madrigalmapsWindow && !madrigalmapsWindow.isDestroyed()) {
        madrigalmapsWindow.show();
        return;
    }

    // Create the browser window.
    madrigalmapsWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: path.join(__dirname, "../img/favicon-madrigalmaps.png"),
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            webviewTag: true,
        },
    });

    madrigalmapsWindow.setWindowButtonVisibility(false);
    madrigalmapsWindow.loadFile(path.join(__dirname, "../madrigalmaps.html"));
}

let modelviewerWindow: BrowserWindow = null;
function windowShowModelviewer() {
    if(modelviewerWindow && !modelviewerWindow.isDestroyed()) {
        modelviewerWindow.show();
        return;
    }

    // Create the browser window.
    modelviewerWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: path.join(__dirname, "../img/favicon-modelviewer.png"),
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            webviewTag: true,
        },
    });

    modelviewerWindow.setWindowButtonVisibility(false);
    modelviewerWindow.loadFile(path.join(__dirname, "../modelviewer.html"));
}




ipcMain.on('window-close', (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.close();
});

ipcMain.on('window-minimize', (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.minimize();
});

ipcMain.on('window-fullscreen', (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setFullScreen(!win.isFullScreen());
    return win.isFullScreen();
});

ipcMain.on('window-maximize', (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    if(win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
});

ipcMain.on('window-show-flyffipedia', () => windowShowFlyffipedia());
ipcMain.on('window-show-madrigalinside', () => windowShowMadrigalinside());
ipcMain.on('window-show-flyffulator', () => windowShowFlyffulator());
ipcMain.on('window-show-madrigalmaps', () => windowShowMadrigalmaps());
ipcMain.on('window-show-modelviewer', () => windowShowModelviewer());
ipcMain.on('window-create', () => createWindow());

app.on("ready", () => {
    createWindow();

    // globalShortcut.register('CommandOrControl+1', () => mainWindow.webContents.send("game-sendKeypress", "1"));
    // globalShortcut.register('CommandOrControl+2', () => mainWindow.webContents.send("game-sendKeypress", "2"));
    // globalShortcut.register('CommandOrControl+3', () => mainWindow.webContents.send("game-sendKeypress", "3"));
    // globalShortcut.register('CommandOrControl+4', () => mainWindow.webContents.send("game-sendKeypress", "4"));
    // globalShortcut.register('CommandOrControl+5', () => mainWindow.webContents.send("game-sendKeypress", "5"));
    // globalShortcut.register('CommandOrControl+6', () => mainWindow.webContents.send("game-sendKeypress", "6"));
    // globalShortcut.register('CommandOrControl+7', () => mainWindow.webContents.send("game-sendKeypress", "7"));
    // globalShortcut.register('CommandOrControl+8', () => mainWindow.webContents.send("game-sendKeypress", "8"));
    // globalShortcut.register('CommandOrControl+9', () => mainWindow.webContents.send("game-sendKeypress", "9"));
    // globalShortcut.register('CommandOrControl+0', () => mainWindow.webContents.send("game-sendKeypress", "0"));
});
app.on("window-all-closed", () => app.quit());

