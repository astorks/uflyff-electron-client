import { app, BrowserWindow, ipcMain, globalShortcut, webContents } from "electron";
import { windowStateKeeper, WindowStateKeeper } from './util/windowStateKeeper';
import * as path from "path";

let gameviewWindowStateKeeper: WindowStateKeeper;
let registeredGlobalShortcuts: Array<string> = [];

function createGameView(openDevTools = false) {
    const wnd = new BrowserWindow({
        x: gameviewWindowStateKeeper.x,
        y: gameviewWindowStateKeeper.y,
        width: gameviewWindowStateKeeper.width,
        height: gameviewWindowStateKeeper.height,
        fullscreen: gameviewWindowStateKeeper.isFullscreen,
        minWidth: 410,
        minHeight: 300,
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

    if(openDevTools) {
        wnd.webContents.openDevTools();
    }

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

ipcMain.handle("globalShortcut:isRegistered", (_, keyCode: string) => globalShortcut.isRegistered(keyCode));
ipcMain.handle("globalShortcut:register", (event, keyCode: string) => {
    const webContents = event.sender;
    return globalShortcut.register(keyCode, () => webContents.send('game:sendKeypress', keyCode));
});
ipcMain.on("globalShortcut:unregister", (_, keyCode: string) => globalShortcut.unregister(keyCode));

ipcMain.on("window:createWebView", (_, url: string) => createWebView(url));
ipcMain.on("window:createGameView", () => createGameView());
app.on("window-all-closed", () => app.quit());


(async function startup() {
    gameviewWindowStateKeeper = await windowStateKeeper('main');
    await app.whenReady();
    createGameView(true);
})();