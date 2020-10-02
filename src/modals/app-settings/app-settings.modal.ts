import { Component } from "@angular/core";
import { ElectronProvider } from "../../providers/electron/electron";
import { NavController } from "ionic-angular";

@Component({
    selector: 'app-settings',
    templateUrl: 'app-settings.modal.html'
})
export class AppSettings {
    fullScreen: boolean = false;

    constructor(private electron: ElectronProvider, private nav: NavController) {
        this.fullScreen = this.electron.isFullScreen();
    }

    onFullScreen() {
        this.fullScreen = this.electron.maximizeWindow();
    }

    onClose() {
        this.electron.closeWindow();
    }

    onCloseModal() {
        this.nav.pop();
    }
}