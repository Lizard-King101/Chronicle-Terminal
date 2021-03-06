import { Injectable } from '@angular/core';
declare var electron: any;
const { BrowserWindow } = electron.remote;
const { webFrame } = electron.webFrame;
/*
  Generated class for the ElectronProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ElectronProvider {
  ipc: any = electron.ipcRenderer;
  kiosk: boolean = false;
  constructor() {
    console.log(electron);
    
    // webFrame.setZoomFactor(1);
    // webFrame.setZoomLevelLimits(1, 1);
    webFrame.setVisualZoomLevelLimits(1, 1);
    // webFrame.setLayoutZoomLevelLimits(0, 0);
  }

  openNewWindow(page = false) {
    if (page) {

    } else {
      this.ipc.send('open-window', { id: 'something' });
    }
  }

  minimizeWindow() {
    let window = BrowserWindow.getFocusedWindow();
    window.minimize();
  }

  maximizeWindow() {
    let window = BrowserWindow.getFocusedWindow();
    if (window && window.isMaximized()) {
      window.unmaximize();
      return false;
    } else {
      window.maximize();
      return true;
    }
  }

  toggleKiosk() {
    let window = BrowserWindow.getFocusedWindow();
    this.kiosk = !this.kiosk;
    window.setKiosk(this.kiosk);
  }

  closeWindow() {
    let window = BrowserWindow.getFocusedWindow();
    window.close();
  }

  isFullScreen() {
    let window = BrowserWindow.getFocusedWindow();
    if (window && window.isMaximized()) {
      return true;
    } else {
      return false;
    }
  }

  setActivity(activity: Activity) {
    this.ipc.send('discord-status', activity);
  }

  localRename(renames: Array<any>) {
    this.ipc.send('local-rename', {renames});
    this.ipc.once('local-rename-reply', (e, reply)=>{
      console.log('rename response', reply);
    });
  }

  localSave(file, data){
    this.ipc.send('local-store', {file, data });
    this.ipc.once('local-store-reply', (e ,reply)=>{
      console.log('store response',reply);
    });
  }

  localDelete(path) {
    this.ipc.send('local-delete', {path});
    this.ipc.once('local-delete-reply', (e, reply) => {
      console.log('delete response', reply);
    })
  }
  
  localGet(file){
    return new Promise((res) => {
      this.ipc.send('local-get', {file });
      this.ipc.once('local-get-reply', (e, data)=>{
        res(data);
      });
    })
  }

  localLoadDirectory(directory) {
    return new Promise((res) => {
      this.ipc.send('local-folder', {directory });
      this.ipc.once('local-folder-reply', (e, data)=>{
        res(data);
      });
    })
  }

}

export interface Activity {
  details: string;
  state: string;
  largeImageKey?: 'seige' | 'seige-standing' | 'level-debug';
  largeImageText?: string;
  smallImageKey?: 'seige' | 'seige-standing';
  smallImageText: string;
  partyId?: string;
  partySize?: number;
  partyMax?: number;
  joinSecret?: string;
  instance: boolean;
} 
