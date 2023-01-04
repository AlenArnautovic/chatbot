import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { leftMessageLayout, MessageLayout, MessageObject, rightMessageLayout } from './chatbotMainSupport';

@Component({
  selector: 'app-chatbot-main-window',
  templateUrl: './chatbot-main-window.component.html',
  styleUrls: ['./chatbot-main-window.component.css']
})
export class ChatbotMainWindowComponent implements OnInit {
  panelHeader = "Chatbot";
  inputFieldValue!: string; 
  items!: MenuItem[];
  
  messageObjects: MessageObject[] = [];
  constructor(){

  }
  ngOnInit() {
    this.createMenu();
  }
  /**
   * Creates an new Message as a chatbubble
   * @param conent message content
   * @param isAnswer true if message is created from chatbot else false
   */
  createMessage(conent:string, isAnswer:boolean){
    const newMessage: MessageObject = {
      content: conent,
      messageLayout: isAnswer ? leftMessageLayout : rightMessageLayout
    }
    this.messageObjects.push(newMessage);
  }

  onSendMessage(){
    if(this.inputFieldValue.trim().length >0){
      this.createMessage(this.inputFieldValue, false);
    }
    this.inputFieldValue = "";
  }
openColorChanger(){

}

  createMenu(){
    this.items = [
      {
          label: 'Options',
          items: [{
              label: 'Change Color',
              icon: 'pi pi-palette',
              command: () => {
                  this.openColorChanger();
              }
          }]
        }
      ]
  }
}
