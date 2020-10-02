import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { ColorPickerPage } from '../popover/color-picker/color-picker';
import { ElectronProvider } from '../providers/electron/electron';
import { HttpClientModule } from '@angular/common/http';
import { DataManager } from '../providers/DataManager';
import { Map } from '../providers/map';

import { Inventories } from '../providers/Inventories';
import { Inventory } from '../components/inventory/inventory';
import { InventoryWindow } from '../components/inventory-window/inv_window';
import { Item } from '../components/item/item';

import { StashPage } from '../pages/home/stash/stash';
import { AppSettings } from '../modals/app-settings/app-settings.modal';
import { PinPage } from '../modals/pin/pin.modal';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PinPage,
    StashPage,
    ColorPickerPage,
    Inventory,
    InventoryWindow,
    Item,
    AppSettings,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PinPage,
    StashPage,
    ColorPickerPage,
    Inventory,
    InventoryWindow,
    Item,
    AppSettings
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ElectronProvider,
    DataManager,
    Inventories,
    Map
  ]
})
export class AppModule {}
