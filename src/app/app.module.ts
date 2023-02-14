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
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { AvatarModule } from 'primeng/avatar';

@NgModule({
  declarations: [AppComponent, ChatbotMainWindowComponent, LoginComponent],
  imports: [
    BrowserModule,
    AvatarModule,
    HttpClientModule,
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
    RouterModule.forRoot([
      { path: '', component: ChatbotMainWindowComponent },
      { path: 'login', component: LoginComponent },
    ]),
  ],
  providers: [ConfirmationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
