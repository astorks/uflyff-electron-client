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

function makeid(length: number): string {
    let result           = '';
    const characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const gameview: any = document.querySelector('.game-view');
let game: Game = null;
const selectProfileDialog = new bootstrap.Modal(document.querySelector('#select-profile-modal'));
const createProfileDialog = new bootstrap.Modal(document.querySelector('#create-profile-modal'));

let profileList: Array<GameProfile> = [
    { key: 'default', name: 'Default Profile', icon: 'https://flyffipedia.com/Icons/Monsters/aibatt.png'}
];

function readProfileList() {
    const profileListStorage = window.localStorage.getItem("profile-list");
    if(profileListStorage) {
        profileList = JSON.parse(profileListStorage);
    }
}

function saveProfileList() {
    window.localStorage.setItem("profile-list", JSON.stringify(profileList));
}

function buildProfileListHtml() {
    const selectProfileList = document.querySelector('#select-profile-list');
    const selectProfileListItemTemplate = document.querySelector<HTMLAnchorElement>('#select-profile-list-item-template a');
    selectProfileList.innerHTML = '';

    for(let i = 0; i < profileList.length; i++) {
        const profile = profileList[i];
        const profileNode = selectProfileListItemTemplate.cloneNode(true) as HTMLAnchorElement;
        const deleteProfileBtn = profileNode.querySelector<HTMLButtonElement>('.delete-profile-btn');

        if(profileList.length <= 1) {
        deleteProfileBtn.classList.add('hidden');
        }

        profileNode.onclick = () => {
            game = new Game(profile);
        };
        profileNode.querySelector<HTMLElement>('.profile-name').innerText = profile.name;
        profileNode.querySelector<HTMLImageElement>('.profile-icon').src = profile.icon;

        deleteProfileBtn.onclick = (e) => {
            e.stopPropagation();
            if(confirm('Are you sure you want to delete the profile "' + profile.name + '"?')) {
                profileList.splice(i, 1);
                saveProfileList();
                buildProfileListHtml();
            }
        }

        selectProfileList.appendChild(profileNode);
    }
}

function showCreateProfileDialog() {
    selectProfileDialog.hide();
    createProfileDialog.show();
}

function showSelectProfileDialog() {
    createProfileDialog.hide();
    selectProfileDialog.show();
}

function createProfile() {
    const profileKey = 'profile-' + makeid(6);
    const profileIcon = document.querySelector<HTMLInputElement>('[name=listGroupCheckableRadios]:checked').value;
    const profileName = document.querySelector<HTMLInputElement>('#profile-name-input').value;

    profileList.push({ key: profileKey, name: profileName, icon: profileIcon });
    saveProfileList();
    buildProfileListHtml();

    createProfileDialog.hide();
    selectProfileDialog.show();
}

function resetDefaultProfile() {
    profileList = [
        { key: 'default', name: 'Default Profile', icon: 'https://flyffipedia.com/Icons/Monsters/aibatt.png'}
    ];
    saveProfileList();
    buildProfileListHtml();
}

interface GameProfile {
    key: string;
    name: string,
    icon: string
}

class Game {
    constructor(public readonly selectedProfile: GameProfile) {
        gameview.partition = 'persist:' + selectedProfile.key;
        gameview.src = 'https://universe.flyff.com/play';
        selectProfileDialog.hide();
        document.querySelector<HTMLButtonElement>('.home-btn').disabled = false;
        document.querySelector<HTMLButtonElement>('.play-btn').disabled = false;
        document.querySelector<HTMLButtonElement>('.toggle-mute-btn').disabled = false;
        document.querySelector<HTMLElement>('.title-bar-title').innerText = 'Flyff Universe - ' + selectedProfile.name;
        document.querySelector<HTMLElement>('title').innerText = 'Flyff Universe - ' + selectedProfile.name;
    }

    public sendKeypress(keyCode: string, modifiers: any): void {
        gameview.sendInputEvent({
            type: "keyDown",
            keyCode: keyCode,
            modifiers: modifiers
        });
        gameview.sendInputEvent({
            type: "char",
            keyCode: keyCode,
            modifiers: modifiers
        });
        gameview.sendInputEvent({
            type: "keyUp",
            keyCode: keyCode,
            modifiers: modifiers
        });
    }

    public copy(): void {
        gameview.copy()
    }

    public paste(): void {
        gameview.paste()
    }

    public toggleAudioMute(): void  {
        gameview.audioMuted = !gameview.audioMuted;
        if(gameview.audioMuted) {
            document.querySelector('.toggle-mute-btn').classList.add('muted');
        } else {
            document.querySelector('.toggle-mute-btn').classList.remove('muted');
        }
    }
}

gameview.addEventListener('console-message', (e: any) => {
    if(e.level == 0) console.trace('[GAME]', e.message);
    else if(e.level == 1) console.info('[GAME]', e.message);
    else if(e.level == 2) console.warn('[GAME]', e.message);
    else if(e.level == 3) console.error('[GAME]', e.message);
});

document.querySelector('.fullscreen-btn')?.addEventListener('click', () => window.electronAPI.window.fullscreen());
document.querySelector('.close-btn')?.addEventListener('click', () => window.electronAPI.window.close());
document.querySelector('.min-btn')?.addEventListener('click', () => window.electronAPI.window.minimize());
document.querySelector('.max-btn')?.addEventListener('click', () => console.log(window.electronAPI.window.maximize()));
document.querySelector('.home-btn')?.addEventListener('click', (e) => { gameview.src = 'https://universe.flyff.com/user/login'; });
document.querySelector('.play-btn')?.addEventListener('click', () => { gameview.src = 'https://universe.flyff.com/play'; });
document.querySelector('.toggle-mute-btn')?.addEventListener('click', () => game.toggleAudioMute());
document.querySelector('.new-window-btn')?.addEventListener('click', () => window.electronAPI.window.createGameView());
document.querySelector('.flyffipedia-btn')?.addEventListener('click', () => console.log(window.electronAPI.window.createWebView('https://flyffipedia.com/')));
document.querySelector('.madrigalinside-btn')?.addEventListener('click', () => console.log(window.electronAPI.window.createWebView('https://madrigalinside.com/')));
document.querySelector('.flyffulator-btn')?.addEventListener('click', () => console.log(window.electronAPI.window.createWebView('https://flyffulator.com/')));
document.querySelector('.madrigalmaps-btn')?.addEventListener('click', () => console.log(window.electronAPI.window.createWebView('https://www.madrigalmaps.com/')));
document.querySelector('.modelviewer-btn')?.addEventListener('click', () => console.log(window.electronAPI.window.createWebView('https://flyffmodelviewer.com/')));

window.electronAPI.game.onSendKeypress((event: any, keyCode: string, modifiers: any) => game.sendKeypress(keyCode, modifiers));

readProfileList();
buildProfileListHtml();

document.querySelector('#cancel-create-profile-btn').addEventListener('click', () => {
    createProfileDialog.hide();
    selectProfileDialog.show();
});

document.querySelector('#save-create-profile-btn').addEventListener('click', () => createProfile());

selectProfileDialog.show();