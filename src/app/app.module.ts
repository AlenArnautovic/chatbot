import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatbotMainWindowComponent } from './components/chatbot-main-window/chatbot-main-window.component';
import {HttpClientModule} from '@angular/common/http';
import {PanelModule} from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import { FormsModule } from '@angular/forms';
import {MenuModule} from 'primeng/menu';
import {SlideMenuModule} from 'primeng/slidemenu';

@NgModule({
  declarations: [
    AppComponent,
    ChatbotMainWindowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PanelModule,
    BrowserAnimationsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    FormsModule,
    MenuModule,
    SlideMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
