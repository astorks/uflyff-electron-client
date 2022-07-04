/// <amd-module name="bootstrap"/>

declare const electronAPI: ElectronApiInterface;

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