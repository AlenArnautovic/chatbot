import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';import { CommunicationService } from 'src/app/services/communication/communication.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { leftMessageLayout, MessageObject, rightMessageLayout } from './chatbotMainSupport';
import { invertColor, returnColorForAnswers, returnColorForQuestions } from './colorHelper';
import { messageTypes } from './messageTypes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatbot-main-window',
  templateUrl: './chatbot-main-window.component.html',
  styleUrls: ['./chatbot-main-window.component.css']
})
export class ChatbotMainWindowComponent implements OnInit {
  panelHeader = "Chatbot";
  isTypingContent = 'Chatbot is typing...'
  
  showIsTyping = false;

  inputFieldValue!: string; 
  items!: MenuItem[];
  messageObjects: MessageObject[] = [];
  backgroundColor = "custom-card-body";
  constructor(private themeSerivce: ThemeService, private communicationService: CommunicationService, private router : Router ){
    this.createMessage('Test Message',true);
  }

  ngOnInit() {
    this.createMenu();
  }

  logIn(){
    console.log("Test");
    this.router.navigate(['/login']); 
  }

  /**
   * Creates an new Message as a chatbubble
   * @param conent message content
   * @param isAnswer true if message is created from chatbot else false
   */
  createMessage(conent:string, isAnswer:boolean){
    const newMessage: MessageObject = {
      content: conent,
      messageLayout: isAnswer ? leftMessageLayout : rightMessageLayout,
    }
    const currentTheme = this.themeSerivce.getCurrentTheme();
    if(isAnswer){
      newMessage.messageLayout.backgroundColor = returnColorForAnswers(currentTheme,false);
      newMessage.messageLayout.textColor = invertColor(returnColorForAnswers(currentTheme,true));
    }else{
      newMessage.messageLayout.backgroundColor = returnColorForQuestions(currentTheme,false);
      newMessage.messageLayout.textColor = invertColor(returnColorForQuestions(currentTheme,true));
    }

    this.messageObjects.push(newMessage);
  }

  async onSendMessage(){
    if(this.inputFieldValue.trim().length >0){
      this.createMessage(this.inputFieldValue, false);
      this.showIsTyping = true;
      const response = await this.communicationService.sendMessageToDialogFlow(this.inputFieldValue);
      this.wait(800);
      this.showIsTyping = false;
      this.createMessage(response.fulfillmentText,true);
    }
    this.inputFieldValue = "";
  }

  //TODO maybe rework this fuction because it pauses the whole code
  //https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
  wait(ms:number){
    const start = new Date().getTime();
    let end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }
 
changeThemeForExistingMessages(){
  const currentTheme = this.themeSerivce.getCurrentTheme();
  this.messageObjects.forEach(element => {
    if(element.messageLayout.messageType == messageTypes.question){
    element.messageLayout.backgroundColor= returnColorForQuestions(currentTheme,false);
    element.messageLayout.textColor = invertColor(returnColorForQuestions(currentTheme,true));
    }else{
      element.messageLayout.backgroundColor = returnColorForAnswers(currentTheme,false);
      element.messageLayout.textColor = invertColor(returnColorForAnswers(currentTheme,true));
    }
  });
  console.log(this.themeSerivce.getCurrentTheme());
}

changeTheme(theme:string){
  this.themeSerivce.switchTheme(theme);
  this.changeThemeForExistingMessages();
}

openSizeEditor(){
  //TODO
}
  createMenu(){
    this.items = [
      {
          label: 'Change Theme',
          icon: 'pi pi-palette',
          items: [
            {
              label: 'Light Theme',
              icon: 'pi pi-sun',
              items:[
                {
                  label: 'Light Blue',
                  command: ()=>{
                    this.changeTheme('lara-light-blue');
                  }
                },
                {
                  label: 'Light Indigo',
                  command: ()=>{
                    this.changeTheme('lara-light-indigo');
                  }
                },
                {
                  label: 'Light Purple',
                  command: ()=>{
                    this.changeTheme('lara-light-purple');
                  }
                },
                {
                  label: 'Light Teal',
                  command: ()=>{
                    this.changeTheme('lara-light-teal');
                  }
                }
              ]
          },
          {
            label: 'Dark Theme',
            icon: 'pi pi-moon',
            items: [
              {
                label: 'Dark Blue',
                command: () => {
                    this.changeTheme('lara-dark-blue');
                }
            },{
              label: 'Dark Indigo',
              command: ()=>{
                this.changeTheme('lara-dark-indigo');
              }
            },{
              label: 'Dark Purple',
              command: ()=>{
                this.changeTheme('lara-dark-purple');
              }
            },
            {
              label: 'Dark Teal',
              command: ()=>{
                this.changeTheme('lara-dark-teal');
              }
            }
            ]
        }
        ]
        },{
          label: 'Text Size',
          icon: 'pi pi-comment',
          command: ()=>{
            this.openSizeEditor();
          }
        }

      ]
  }
}
