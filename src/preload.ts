import { contextBridge, ipcRenderer } from 'electron';

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions]);
  }
});

contextBridge.exposeInMainWorld('electronAPI', {
  window: {
    close: () => ipcRenderer.send('window:close'),
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    fullscreen: () => ipcRenderer.send('window:fullscreen'),
    setAlwaysOnTop: (flag: boolean, level = 10) => ipcRenderer.invoke('window:setAlwaysOnTop', flag, level),

    createWebView: (url: string) => ipcRenderer.send('window:createWebView', url),
    createGameView: () => ipcRenderer.send('window:createGameView'),
  },
  game: {
    onSendKeypress: (callback: (event: any, keyCode: string, modifiers: any) => void) => ipcRenderer.on('game:sendKeypress', callback),
    onCopy: (callback: any) => ipcRenderer.on('game:copy', callback),
    onPaste: (callback: any) => ipcRenderer.on('game:paste', callback),
  },
});

// window.electronAPI.onGameSendKeypress((event, keyCode, modifiers) => game.sendKeypress(keyCode, modifiers));