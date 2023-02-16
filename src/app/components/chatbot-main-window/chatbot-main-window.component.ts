import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  Confirmation,
  ConfirmationService,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import {
  ChoiceObject,
  leftMessageLayout,
  MessageObject,
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
  providers: [MessageService],
})
export class ChatbotMainWindowComponent implements OnInit, AfterViewInit {
  @ViewChild('inputField') inputField!: ElementRef;
  @ViewChild('menuButton') menuButton!: ElementRef;
  @Output() messageEvent = new EventEmitter<string>();

  panelHeader = 'Chatbot';
  isTypingContent = 'is typing...';
  panelSubHeader = 'online';
  mainWindowContainer = '';

  confirmPopup = '';
  showIsTyping = false;
  slideMenuheigth = 230;
  sendButtonDelay = 1000;
  inputDisabled = false;
  inputPlaceholder = 'Say hi...';
  headerButtonsHidden = true;
  inputFieldValue!: string;
  items!: MenuItem[];
  messageObjects: MessageObject[] = [];
  backgroundColor = 'custom-card-body';

  InputAutoFocus = true;
  avatarBadgeContent = 'Hey!';

  constructor(
    private themeSerivce: ThemeService,
    private communicationService: CommunicationService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private confirmationService: ConfirmationService,
    private ref: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngAfterViewInit() {
    const savedMessages = this.communicationService.getSavedMessages();
    if (
      savedMessages != null &&
      savedMessages.length > 0 &&
      savedMessages.length > this.messageObjects.length
    ) {
      this.messageObjects = savedMessages;
    }
    try {
      if (this.messageObjects != null && this.messageObjects.length > 0) {
        this.messageService.add({
          severity: 'info',
          summary: 'Reload',
          detail: 'Reloaded conversation',
        });
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'Terms of Use',
          detail:
            'By typing the first message you agree with our terms of Use. Open the menu to view the Terms.',
        });
      }
    } catch (error) {
      this.createErrorMessage('');
    }
  }

  ngOnInit() {
    this.createMenu();
  }

  closeWindow() {
    this.messageEvent.emit('closeWindow');
    this.communicationService.saveMessages(this.messageObjects);
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
      messageLayout: {
        position: 'flex',
        backgroundColor: '',
        textColor: '',
        messageType: messageTypes.multipleChoice,
        disabled: false,
      },
      isMultipleChoice: true,
      choiceObjects: choiceObjects,
    };
    this.INPUT_setupForMultipleChoice();
    this.messageObjects.push(newMessage);
  }

  INPUT_setupForMultipleChoice() {
    this.showIsTyping = false;
    this.inputFieldValue = '';
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

  createErrorMessage(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: detail.length > 0 ? detail : 'Oops, something went wrong.',
    });
  }

  async onSendMessage() {
    try {
      this.messageService.clear();
      if (
        this.inputFieldValue != null &&
        this.inputFieldValue.trim().length > 0
      ) {
        this.createMessage(this.inputFieldValue, false);
        this.INPUT_blockInput();
        const response =
          await this.communicationService.sendMessageToDialogFlow(
            this.inputFieldValue
          );
        this.wait(700);
        if (!response.isError) {
          if (
            response != null &&
            response.fulfillmentText &&
            response.fulfillmentText.length > 0
          ) {
            this.createMessage(response.fulfillmentText, true);
          }

          if (response.isMultipleChoice) {
            if (
              response.choiceContainer != null &&
              response.choiceContainer.choices != null &&
              response.choiceContainer.choices.length > 0
            ) {
              this.createMultipleChoice(
                this.transformServerMultipleChoice(
                  response.choiceContainer?.choices
                )
              );
            } else {
              this.createErrorMessage('');
            }
          } else {
            this.INPUT_setupForNextInput();
          }
        } else {
          this.createErrorMessage(
            response.errorMessage != null ? response.errorMessage : ''
          );
          this.INPUT_setupForNextInput();
        }
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'Hey',
          detail: 'type something :))',
        });
      }
    } catch (error) {
      console.log('#');
      this.createErrorMessage('');
    }
  }

  INPUT_blockInput() {
    this.toggleInputFooter(true);
    this.showIsTyping = true;
  }

  INPUT_setupForNextInput() {
    this.showIsTyping = false;
    this.inputPlaceholder = 'Type Here...';
    this.toggleInputFooter(false);
    this.inputFieldValue = '';
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
      return choiceObjects;
    } else {
      this.createErrorMessage('');
    }
    return [];
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
        this.wait(1000);
        if (response.isMultipleChoice) {
          this.createMessage(response.fulfillmentText, true);
          this.createMultipleChoice(
            this.transformServerMultipleChoice(
              response.choiceContainer?.choices
            )
          );
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
    this.confirmPopup = `${size}`;
  }

  createTermsOfUsePopUp() {
    const termsOfUse: Confirmation = {
      acceptVisible: false,
      target: this.menuButton.nativeElement,
      rejectLabel: 'Close',
      icon: 'pi pi-info-circle',
      message: `By agreeing to the terms of use (typing and sending a message) you argee that 
        we can save the in the chat mentioned information about yourself and use them for 
        the purpose of appointment booking. We do not transfer the used data to 3rd parties.`,
      reject: () => {
        //
      },
    };
    this.confirmationService.confirm(termsOfUse);
  }

  createMenu() {
    this.items = [
      {
        label: 'Themes',
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
      {
        label: 'Terms of Use',
        icon: 'pi pi-info-circle',
        command: () => {
          this.createTermsOfUsePopUp();
        },
      },
    ];
  }
}
