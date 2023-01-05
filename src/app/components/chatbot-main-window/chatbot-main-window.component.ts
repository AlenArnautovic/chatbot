import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ThemeService } from 'src/app/services/theme.service';
import { leftMessageLayout, MessageLayout, MessageObject, rightMessageLayout } from './chatbotMainSupport';
import { invertColor, returnColorForAnswers, returnColorForQuestions } from './colorHelper';
import { messageTypes } from './messageTypes';

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
  backgroundColor:string = "custom-card-body";
  constructor(private themeSerivce: ThemeService){
    this.createMessage('Test Message',true);
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

  onSendMessage(){
    if(this.inputFieldValue.trim().length >0){
      this.createMessage(this.inputFieldValue, false);
    }
    this.inputFieldValue = "";
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
