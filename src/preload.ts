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
  onGameSendKeypress: (callback: any) => ipcRenderer.on('game-sendKeypress', callback),
  onGameCopy: (callback: any) => ipcRenderer.on('game-copy', callback),
  onGamePaste: (callback: any) => ipcRenderer.on('game-paste', callback),
  onGameLogin: (callback: any) => ipcRenderer.on('game-login', callback),

  windowClose: () => ipcRenderer.send('window-close'),
  windowMinimize: () => ipcRenderer.send('window-minimize'),
  windowMaximize: () => ipcRenderer.send('window-maximize'),
  windowFullscreen: () => ipcRenderer.send('window-fullscreen'),
  windowShowFlyffipedia: () => ipcRenderer.send('window-show-flyffipedia'),
  windowShowMadrigalinside: () => ipcRenderer.send('window-show-madrigalinside'),
  windowShowFlyffulator: () => ipcRenderer.send('window-show-flyffulator'),
  windowShowMadrigalmaps: () => ipcRenderer.send('window-show-madrigalmaps'),
  windowShowModelviewer: () => ipcRenderer.send('window-show-modelviewer'),
  windowCreate: () => ipcRenderer.send('window-create'),
})