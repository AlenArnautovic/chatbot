import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ChatbotMainWindowComponent } from './components/chatbot-main-window/chatbot-main-window.component';
import { HttpClientModule } from '@angular/common/http';
import { PanelModule } from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { AutoFocusModule } from 'primeng/autofocus';
import { ChatbotInplaceComponent } from './components/chatbot-inplace/chatbot-inplace.component';
import { InplaceModule } from 'primeng/inplace';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';

/**
 * by Nicolai Haferkamp
 */
@NgModule({
  declarations: [
    AppComponent,
    ChatbotMainWindowComponent,
    ChatbotInplaceComponent,
  ],
  imports: [
    BrowserModule,
    BadgeModule,
    TooltipModule,
    AvatarModule,
    ToastModule,
    AutoFocusModule,
    HttpClientModule,
    InplaceModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    PanelModule,
    ConfirmPopupModule,
    BrowserAnimationsModule,
    SplitButtonModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    FormsModule,
    MenuModule,
    SlideMenuModule,
  ],
  providers: [ConfirmationService, MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
