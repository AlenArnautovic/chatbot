import { Component } from '@angular/core';
import { leftMessageLayout, MessageLayout, MessageObject, rightMessageLayout } from './chatbotMainSupport';

@Component({
  selector: 'app-chatbot-main-window',
  templateUrl: './chatbot-main-window.component.html',
  styleUrls: ['./chatbot-main-window.component.css']
})
export class ChatbotMainWindowComponent {
  panelHeader = "Chatbot";
  
  messageObjects: MessageObject[] = [{content:'Test1', messageLayout: rightMessageLayout},{content:'Test2', messageLayout: leftMessageLayout},{content:'Test3', messageLayout: rightMessageLayout}];
  constructor(){

  }

}
