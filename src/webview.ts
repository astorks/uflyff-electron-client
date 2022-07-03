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

let windowIsPinned = false;
const webview: any = document.querySelector('#web-view');
webview.src = window.location.hash.substring(1);

webview.addEventListener('load-commit', () => {
    document.querySelector<HTMLButtonElement>('.browse-back-btn').disabled = !webview.canGoBack();
    document.querySelector<HTMLButtonElement>('.browse-forward-btn').disabled = !webview.canGoForward();
});

webview.addEventListener('page-title-updated', (e: { title: string }) => {
    document.querySelector<HTMLElement>('title').innerText = e.title;
    document.querySelector<HTMLElement>('.title-bar-title').innerText = e.title;
});

webview.addEventListener('page-favicon-updated', (e: { favicons: Array<string> }) => {
    if(e.favicons.length >= 1) {
        document.querySelector<HTMLImageElement>('.title-bar-icon').src = e.favicons[0];
    } else {
        document.querySelector<HTMLImageElement>('.title-bar-icon').src = './img/favicon.png';
    }
});

document.querySelector('.close-btn')?.addEventListener('click', () => window.electronAPI.window.close());
document.querySelector('.min-btn')?.addEventListener('click', () => window.electronAPI.window.minimize());
document.querySelector('.max-btn')?.addEventListener('click', () => window.electronAPI.window.maximize());
document.querySelector('.browse-back-btn')?.addEventListener('click', () => webview.goBack());
document.querySelector('.browse-forward-btn')?.addEventListener('click', () => webview.goForward());
document.querySelector('.browse-reload-btn')?.addEventListener('click', () => webview.reload());

document.querySelector('.toggle-pin-btn')?.addEventListener('click', () => {
    windowIsPinned = !windowIsPinned;
    window.electronAPI.window.setAlwaysOnTop(windowIsPinned, 10);
    if(windowIsPinned) {
        document.querySelector('.toggle-pin-btn').classList.add('pined');
    } else {
        document.querySelector('.toggle-pin-btn').classList.remove('pined');
    }
});