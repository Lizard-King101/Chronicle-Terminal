import { Component } from "@angular/core";
import { NavController, ViewController } from "ionic-angular";

@Component({
    selector: 'page-pin',
    templateUrl: 'pin.modal.html'
})
export class PinPage{
    pin: string = '';
    pinHidden: string = '';
    constructor(private view: ViewController) { }

    onPinButton(digit: string) {
        if(this.pin.length < 6) {
            this.pin += digit;
            this.pinHidden = this.pin.split('').map(p => '*').join('');
            console.log(this.pin);
            
        }
    }

    onSubmit() {
        this.view.dismiss({pin: this.pin});
    }
}