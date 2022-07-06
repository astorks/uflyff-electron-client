/// <amd-module name="bootstrap"/>

import { contextBridge, ipcRenderer } from 'electron';

window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('[data-wnd-btn="close"]').forEach((e: Element) => e.addEventListener('click', () => ipcRenderer.send('window:close')));
    document.querySelectorAll('[data-wnd-btn="minimize"]').forEach((e: Element) => e.addEventListener('click', () => ipcRenderer.send('window:minimize')));
    document.querySelectorAll('[data-wnd-btn="maximize"]').forEach((e: Element) => e.addEventListener('click', () => ipcRenderer.send('window:maximize')));
    document.querySelectorAll('[data-wnd-btn="fullscreen"]').forEach((e: Element) => e.addEventListener('click', () => ipcRenderer.send('window:fullscreen')));

    document.querySelectorAll('[data-linktype="webview"]')
        .forEach((el: HTMLLinkElement) => el.addEventListener('click', (ev) => {
            const url = el.href;
            ev.preventDefault();
            ipcRenderer.send('window:createWebView', url);
        }));

    console.log(document.querySelectorAll('[data-wnd-btn="close"]'));

    contextBridge.exposeInMainWorld('setTitleColor', (hexColor: string) => {
        const bgLightOrDark = lightOrDark(hexColor);
        const titleBarWrapper = document.querySelector<HTMLElement>('.title-bar-wrapper');
        
        if(titleBarWrapper) {
            titleBarWrapper.style.backgroundColor = hexColor;
            titleBarWrapper.classList.remove('title-bar-dark', 'title-bar-light');
            titleBarWrapper.classList.add('title-bar-' + bgLightOrDark);
        }
    });
});

function lightOrDark(hexColor: string): 'light' | 'dark' {
    const color = +("0x" + hexColor.slice(1).replace(hexColor.length < 5 && /./g, '$&$&'));
    const r = color >> 16;
    const g = color >> 8 & 255;
    const b = color & 255;

    const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    return hsp > 125.5 ? 'light' : 'dark';

}

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
    globalShortcut: {
        isRegistered: (keyCode: string) => ipcRenderer.invoke('globalShortcut:isRegistered', keyCode),
        register: (keyCode: string) => ipcRenderer.invoke('globalShortcut:register', keyCode),
        unregister: (keyCode: string) => ipcRenderer.send('globalShortcut:unregister', keyCode),
    }
});