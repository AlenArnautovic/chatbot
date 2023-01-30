import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Confirmation, ConfirmationService, MenuItem } from 'primeng/api';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import {
  ChoiceObject,
  leftMessageLayout,
  MessageObject,
  multipleChoiceLayout,
  rightMessageLayout,
} from './chatbotMainSupport';
import {
  invertColor,
  returnColorForAnswers,
  returnColorForQuestions,
} from './colorHelper';
import { messageTypes } from './messageTypes';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { choiceServerObject } from 'src/app/services/communication/communicationHelper';

@Component({
  selector: 'app-chatbot-main-window',
  templateUrl: './chatbot-main-window.component.html',
  styleUrls: ['./chatbot-main-window.component.css'],
})
export class ChatbotMainWindowComponent implements OnInit, AfterViewInit {
  @ViewChild('inputField') inputField!: ElementRef;

  panelHeader = 'Chatbot';
  isTypingContent = 'is typing...';
  panelSubHeader = 'online';
  mainWindowContainer = '';
  showIsTyping = false;
  slideMenuheigth = 230;
  inputDisabled = false;
  inputPlaceholder = 'Say hi...';

  inputFieldValue!: string;
  items!: MenuItem[];
  messageObjects: MessageObject[] = [];
  backgroundColor = 'custom-card-body';
  constructor(
    private themeSerivce: ThemeService,
    private communicationService: CommunicationService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private confirmationService: ConfirmationService,
    private ref: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.inputField.nativeElement.focus();
  }

  ngOnInit() {
    this.createMenu();
  }

  logIn() {
    console.log('Test');
    this.router.navigate(['/login']);
  }

  /**
   * Creates an new Message as a chatbubble
   * @param conent message content
   * @param isAnswer true if message is created from chatbot else false
   */
  createMessage(conent: string, isAnswer: boolean) {
    const newMessage: MessageObject = {
      content: conent,
      messageLayout: isAnswer ? leftMessageLayout : rightMessageLayout,
      isMultipleChoice: false,
      choiceObjects: [],
    };
    const currentTheme = this.themeSerivce.getCurrentTheme();
    if (isAnswer) {
      newMessage.messageLayout.backgroundColor = returnColorForAnswers(
        currentTheme,
        false
      );
      newMessage.messageLayout.textColor = invertColor(
        returnColorForAnswers(currentTheme, true)
      );
    } else {
      newMessage.messageLayout.backgroundColor = returnColorForQuestions(
        currentTheme,
        false
      );
      newMessage.messageLayout.textColor = invertColor(
        returnColorForQuestions(currentTheme, true)
      );
    }

    this.messageObjects.push(newMessage);
  }

  createMultipleChoice(choiceObjects: ChoiceObject[]) {
    const newMessage: MessageObject = {
      content: '',
      messageLayout: multipleChoiceLayout,
      isMultipleChoice: true,
      choiceObjects: choiceObjects,
    };
    newMessage.messageLayout.disabled = false;
    this.messageObjects.push(newMessage);
    this.inputPlaceholder = 'Choose an option!';
    this.toggleInputFooter(true);
  }

  disableAllChoiceButtons() {
    this.messageObjects.forEach((messageObject) => {
      if (messageObject.isMultipleChoice) {
        messageObject.messageLayout.disabled = true;
      }
    });
  }

  async onSendMessage() {
    this.toggleInputFooter(true);
    if (this.inputFieldValue.trim().length > 0) {
      this.createMessage(this.inputFieldValue, false);
      this.showIsTyping = true;
      const response = await this.communicationService.sendMessageToDialogFlow(
        this.inputFieldValue
      );
      this.wait(800);
      this.createMessage(response.fulfillmentText, true);
      if (response.isMultipleChoice) {
        this.wait(800);
        //response.fulfillmentText.length > 0 ? this.createMessage(response.fulfillmentText, true) : null;
        this.createMultipleChoice(
          this.transformServerMultipleChoice(response.choiceContainer?.choices)
        );
      }
    } else {
      //TODO Error catching
    }

    this.showIsTyping = false;
    this.inputPlaceholder = 'Type Here...';
    this.toggleInputFooter(false);
    this.inputFieldValue = '';
    this.inputField.nativeElement.focus();
  }

  transformServerMultipleChoice(
    choices: choiceServerObject[] | undefined
  ): ChoiceObject[] {
    const choiceObjects: ChoiceObject[] = [];
    if (choices != undefined) {
      for (const choice of choices) {
        choiceObjects.push({
          label: choice.label,
          event: choice.event,
          description: choice.description,
          isFallback: choice.isFallback,
          symbolClass: choice.isFallback
            ? 'pi pi-times-circle'
            : 'pi pi-info-circle',
        });
      }
    }
    return choiceObjects;
  }

  //TODO maybe rework this fuction because it pauses the whole code
  //https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
  wait(ms: number) {
    const start = new Date().getTime();
    let end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }

  toggleInputFooter(disable: boolean) {
    this.inputDisabled = disable;
  }

  changeThemeForExistingMessages() {
    const currentTheme = this.themeSerivce.getCurrentTheme();
    this.messageObjects.forEach((element) => {
      if (element.messageLayout.messageType == messageTypes.question) {
        element.messageLayout.backgroundColor = returnColorForQuestions(
          currentTheme,
          false
        );
        element.messageLayout.textColor = invertColor(
          returnColorForQuestions(currentTheme, true)
        );
      } else {
        element.messageLayout.backgroundColor = returnColorForAnswers(
          currentTheme,
          false
        );
        element.messageLayout.textColor = invertColor(
          returnColorForAnswers(currentTheme, true)
        );
      }
    });
    console.log(this.themeSerivce.getCurrentTheme());
  }

  confirmChoice(event: any, choiceObj: ChoiceObject) {
    const confirmation: Confirmation = {
      rejectIcon: 'pi pi-times',
      acceptIcon: 'pi pi-check',
      target: event.target,
      message: choiceObj.description,
      icon: choiceObj.isFallback
        ? 'pi pi-exclamation-triangle'
        : 'pi pi-info-circle',
      acceptLabel: choiceObj.isFallback ? 'Yes, I am sure' : 'I consent',
      rejectLabel: 'Back',
      accept: async () => {
        this.toggleInputFooter(false);
        this.disableAllChoiceButtons();
        this.ref.detectChanges();
        const answer = choiceObj.isFallback
          ? 'I do not have any of the mentioned symptoms'
          : `My concern also contains ${choiceObj.label}`;
        this.createMessage(answer, false);
        this.showIsTyping = true;
        const response =
          await this.communicationService.triggerEventInDialogFlow(
            choiceObj.event
          );
        this.wait(800);
        if (response.isMultipleChoice) {
          this.createMessage(response.fulfillmentText, true);
          this.wait(800);
          this.createMultipleChoice(
            this.transformServerMultipleChoice(
              response.choiceContainer?.choices
            )
          );
          console.log(this.messageObjects);
        } else {
          this.createMessage(response.fulfillmentText, true);
        }
        this.showIsTyping = false;
      },
      reject: () => {
        //
      },
    };

    this.confirmationService.confirm(confirmation);
  }

  changeTheme(theme: string) {
    this.themeSerivce.switchTheme(theme);
    this.changeThemeForExistingMessages();
  }

  changeSizeOfComponent(size: number) {
    const zoomlevel = `zoom: ${size}`;
    this.mainWindowContainer = zoomlevel;
  }

  createMenu() {
    this.items = [
      {
        label: 'Change Theme',
        icon: 'pi pi-palette',
        items: [
          {
            label: 'Light Theme',
            icon: 'pi pi-sun',
            items: [
              {
                label: 'Light Blue',
                command: () => {
                  this.changeTheme('lara-light-blue');
                },
              },
              {
                label: 'Light Indigo',
                command: () => {
                  this.changeTheme('lara-light-indigo');
                },
              },
              {
                label: 'Light Purple',
                command: () => {
                  this.changeTheme('lara-light-purple');
                },
              },
              {
                label: 'Light Teal',
                command: () => {
                  this.changeTheme('lara-light-teal');
                },
              },
            ],
          },
          {
            label: 'Dark Theme',
            icon: 'pi pi-moon',
            items: [
              {
                label: 'Dark Blue',
                command: () => {
                  this.changeTheme('lara-dark-blue');
                },
              },
              {
                label: 'Dark Indigo',
                command: () => {
                  this.changeTheme('lara-dark-indigo');
                },
              },
              {
                label: 'Dark Purple',
                command: () => {
                  this.changeTheme('lara-dark-purple');
                },
              },
              {
                label: 'Dark Teal',
                command: () => {
                  this.changeTheme('lara-dark-teal');
                },
              },
            ],
          },
        ],
      },
      {
        label: 'Chatbot Size',
        icon: 'pi pi-search',
        items: [
          {
            label: 'Large',
            icon: 'pi pi-window-maximize',
            command: () => {
              this.changeSizeOfComponent(1.3);
            },
          },
          {
            label: 'Standard',
            icon: 'pi pi-stop',
            command: () => {
              this.changeSizeOfComponent(1);
            },
          },
          {
            label: 'Small',
            icon: 'pi pi-window-minimize',
            command: () => {
              this.changeSizeOfComponent(0.8);
            },
          },
        ],
      },
    ];
  }
}
