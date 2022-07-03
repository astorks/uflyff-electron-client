/// <amd-module name="bootstrap"/>

declare interface Window {
    electronAPI: ElectronApiInterface;
}

declare interface ElectronApiInterface {
    window: {
        close(): void,
        minimize(): void,
        maximize(): void,
        fullscreen(): void,
        setAlwaysOnTop(flag: boolean, level: number): boolean
        createWebView(url: string): void,
        createGameView():void
    },

    game: {
        onSendKeypress(callback: (event: any, keyCode: string, modifiers: any) => void): void,
        onCopy(callback: (event: any) => void): void,
        onPaste(callback: (event: any) => void): void,
    }
}

document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((tooltipTriggerEl: Element) => new bootstrap.Tooltip(tooltipTriggerEl));

document.querySelectorAll('[data-wnd-btn="close"]').forEach((e: Element) => e.addEventListener('click', () => window.electronAPI.window.close()));
document.querySelectorAll('[data-wnd-btn="minimize"]').forEach((e: Element) => e.addEventListener('click', () => window.electronAPI.window.minimize()));
document.querySelectorAll('[data-wnd-btn="maximize"]').forEach((e: Element) => e.addEventListener('click', () => window.electronAPI.window.maximize()));
document.querySelectorAll('[data-wnd-btn="fullscreen"]').forEach((e: Element) => e.addEventListener('click', () => window.electronAPI.window.fullscreen()));