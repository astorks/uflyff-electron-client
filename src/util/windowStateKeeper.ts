import { BrowserWindow } from 'electron';
import settings from 'electron-settings';

export const windowStateKeeper = async (windowName: string): Promise<WindowStateKeeper> => {
    let window: BrowserWindow;
    let windowState: any;

    const setBounds = async () => {
        // Restore from appConfig
        if (await settings.has(`windowState.${windowName}`)) {
            windowState = await settings.get(`windowState.${windowName}`);
            return;
        }

        windowState = {
            x: undefined,
            y: undefined,
            width: 1280,
            height: 720,
            isMaximized: false,
            isFullscreen: false
        };
    };

    const saveState = async () => {
        windowState.isMaximized = window.isMaximized();
        windowState.isFullscreen = window.isFullScreen();
        await settings.set(`windowState.${windowName}`, windowState);
    };

    const track = (win: BrowserWindow) => {
        window = win;
        win.on('resize', saveState);
        win.on('move', saveState);
        win.on('close', saveState);
        win.on('enter-full-screen', saveState);
        win.on('leave-full-screen', saveState);
    };

    await setBounds();

    return {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        isMaximized: windowState.isMaximized,
        isFullscreen: windowState.isFullscreen,
        track,
    };
};

export interface WindowStateKeeper {
    x: number;
    y: number;
    width: number;
    height: number;
    isMaximized: boolean;
    isFullscreen: boolean;
    track(win: BrowserWindow): void;
}