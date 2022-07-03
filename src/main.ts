import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import * as path from "path";

function createGameView() {
    const wnd = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: path.join(__dirname, "../img/favicon.png"),
        titleBarStyle: "hidden",

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            webviewTag: true,
        },
    });

    if (wnd.setWindowButtonVisibility) {
        wnd.setWindowButtonVisibility(false);
    }

    wnd.loadFile(path.join(__dirname, "../gameview.html"));
    // wnd.webContents.openDevTools();
    return wnd;
}

function createWebView(url = "https://google.com") {
    const wnd = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: path.join(__dirname, "../img/favicon.png"),
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            webviewTag: true,
        },
    });

    if (wnd.setWindowButtonVisibility) {
        wnd.setWindowButtonVisibility(false);
    }

    wnd.loadFile(path.join(__dirname, "../webview.html"), { hash: url });
}

ipcMain.on("window:close", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.close();
});

ipcMain.on("window:minimize", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.minimize();
});

ipcMain.on("window:fullscreen", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setFullScreen(!win.isFullScreen());
    return win.isFullScreen();
});

ipcMain.on("window:maximize", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
});

ipcMain.handle("window:setAlwaysOnTop", (event, flag, level: 10) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setAlwaysOnTop(flag, 'normal', level);
    if(flag) {
        win.setOpacity(0.5);
    } else {
        win.setOpacity(1);
    }
    return win.isAlwaysOnTop();
});

ipcMain.on("window:createWebView", (ev, url: string) => createWebView(url));
ipcMain.on("window:createGameView", () => createGameView());

app.on("ready", () => {
    createGameView();

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
