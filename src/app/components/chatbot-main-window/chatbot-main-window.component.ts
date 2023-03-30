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
  MessageLayout,
  MessageObject,
  rightMessageLayout,
  timeStampPlaceholder,
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

/**
 * by Nicolai Haferkamp
 */
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
  messageTimeStamp = '';
  messageTimeStampColor = '';

  sendButtonIcon = 'fa fa-light fa-paper-plane';
  sendButtonHidden = false;

  confirmPopup = '';
  showIsTyping = false;
  slideMenuheigth = 230;
  sendButtonDelay = 1000;
  inputDisabled = false;
  inputPlaceholder = 'Say Hi...';
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
      this.INPUT_setInputFieldstatus();
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

  /**
   * Resets the Conversation
   */
  async onReloadChatbot() {
    await this.communicationService.triggerEventInDialogFlow(
      'event_reset_contexts'
    );
    this.messageObjects = [];
    this.INPUT_setupForNextInput();
    this.sendButtonHidden = false;
    this.messageService.clear();
  }

  /**
   * Closes the chatbot conversation
   */
  endConversation() {
    this.INPUT_blockInputForNextConvo();
    this.sendButtonHidden = true;
  }

  ngOnInit() {
    this.createMenu();
  }

  closeWindow() {
    this.messageEvent.emit('closeWindow');
    this.communicationService.saveMessages(this.messageObjects);
  }

  /**
   * Creates an new Message as a chatbubble
   * @param conent message content
   * @param isAnswer true if message is created from chatbot else false
   */
  createMessage(conent: string, isAnswer: boolean) {
    let newMessageLayout: MessageLayout;
    if (isAnswer) {
      newMessageLayout = { ...leftMessageLayout };
    } else {
      newMessageLayout = { ...rightMessageLayout };
    }

    const newMessage: MessageObject = {
      content: conent,
      messageLayout: newMessageLayout,
      isMultipleChoice: false,
      choiceObjects: [],
    };
    const currentTheme = this.themeSerivce.getCurrentTheme();
    let textHexCode: string;
    if (isAnswer) {
      newMessage.messageLayout.backgroundColor = returnColorForAnswers(
        currentTheme,
        false
      );
      textHexCode = invertColor(returnColorForAnswers(currentTheme, true));
      newMessage.messageLayout.textColor = textHexCode;
    } else {
      newMessage.messageLayout.backgroundColor = returnColorForQuestions(
        currentTheme,
        false
      );
      textHexCode = invertColor(returnColorForQuestions(currentTheme, true));
      newMessage.messageLayout.textColor = textHexCode;
    }
    this.setMessageTimeStamp(textHexCode, newMessage);
    this.messageObjects.push(newMessage);
  }

  /**
   * Creates multiple-choice block out of given object list
   * @param choiceObjects ChoiceObject[]
   */
  createMultipleChoice(choiceObjects: ChoiceObject[]) {
    const newMessage: MessageObject = {
      content: '',
      messageLayout: {
        position: 'flex',
        backgroundColor: '',
        textColor: '',
        messageType: messageTypes.multipleChoice,
        disabled: false,
        timeStamp: timeStampPlaceholder,
      },
      isMultipleChoice: true,
      choiceObjects: choiceObjects,
    };
    this.messageObjects.push(newMessage);
    this.INPUT_setupForMultipleChoice();
  }

  /**
   * Sets up Inputfield for Multiple-choice
   */
  INPUT_setupForMultipleChoice() {
    this.showIsTyping = false;
    this.inputFieldValue = '';
    this.INPUT_setInputFieldstatus();
  }

  /**
   * Sets placeholder for input field depending on previous message in messageObjets list
   */
  INPUT_setInputFieldstatus() {
    if (this.messageObjects.length == 0) {
      this.inputPlaceholder = 'Say Hi...';
      this.toggleInputFooter(false);
    } else if (
      this.messageObjects[this.messageObjects.length - 1].isMultipleChoice
    ) {
      this.inputPlaceholder = 'Choose an Option...';
      this.toggleInputFooter(true);
    } else if (
      !this.messageObjects[this.messageObjects.length - 1].isMultipleChoice
    ) {
      this.inputPlaceholder = 'Type Here...';
      this.toggleInputFooter(false);
    }
  }

  /**
   * Disables all Multiple-Choice buttons that are already in messageObjects
   */
  disableAllChoiceButtons() {
    this.messageObjects.forEach((messageObject) => {
      if (messageObject.isMultipleChoice) {
        messageObject.messageLayout.disabled = true;
      }
    });
  }

  /**
   * Creates an Error pop-up Message
   * @param detail string
   */
  createErrorMessage(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: detail.length > 0 ? detail : 'Oops, something went wrong.',
    });
  }

  createWarnMessage(detail: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Cau tion!',
      detail:
        detail.length > 0
          ? detail
          : 'The reccomendation is oriented solely on your input, and may deviate from a real doctors conclusion. Please take this result carefully!',
    });
  }

  /**
   * Called form html when the send Button is pressed. Sends content to server and awaits answer.
   */
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
        if (response != null) {
          this.wait(700);
          if (!response.isError) {
            if (
              response != null &&
              response.fulfillmentText &&
              response.fulfillmentText.length > 0
            ) {
              this.createMessage(response.fulfillmentText, true);
              console.log(response.fulfillmentText);
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
            } else if (
              response.isEndMessage != null &&
              response.isEndMessage == true
            ) {
              this.endConversation();
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
          this.createErrorMessage(
            'Oops something went wrong. Please reload the website!'
          );
        }
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'Hey',
          detail: 'type something :))',
        });
      }
    } catch (error) {
      this.createErrorMessage(
        'Oops something went wrong. Please reload the website!'
      );
    }
  }

  /**
   * Sets the current time into the timestamp parameter for the given message.
   * @param hexCode Color of Text
   * @param message MessageObject
   */
  setMessageTimeStamp(hexCode: string, message: MessageObject) {
    const hour = this.adjustTimeSets(new Date().getUTCHours());
    const minutes = this.adjustTimeSets(new Date().getUTCMinutes());
    message.messageLayout.timeStamp = {
      hidden: false,
      value: hour + ':' + minutes,
      color: hexCode,
    };
  }

  /**
   * Adjusts time set into a conform two places value
   * @param count number
   * @returns string
   */
  adjustTimeSets(count: number): string {
    if (count < 10) {
      const countAsString = '0' + count;
      return countAsString;
    } else {
      return count.toString();
    }
  }

  /**
   * Blocks input field. Used when a message is send an a response is awaitet.
   */
  INPUT_blockInput() {
    this.toggleInputFooter(true);
    this.showIsTyping = true;
  }

  INPUT_blockInputForNextConvo() {
    this.showIsTyping = false;
    this.toggleInputFooter(true);
    this.inputFieldValue = '';
    this.inputPlaceholder = 'Conversation ended, Please reload..';
  }

  /**
   * Sets up the input field for next input.
   */
  INPUT_setupForNextInput() {
    this.showIsTyping = false;
    this.INPUT_setInputFieldstatus();
    this.inputFieldValue = '';
  }

  /**
   * Transforms the server information into the front-end objects needed for multiple-choice.
   * @param choices choiceServerObject[]
   * @returns ChoiceObject[]
   */
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

  /**
   * Pauses thread to simulate waiting time for user.
   * @param ms Miliseconds
   */
  //https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
  wait(ms: number) {
    const start = new Date().getTime();
    let end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }

  /**
   * Toggles disabling or enabling the input field.
   * @param disable true if inputfield should be disabled. false otherwise.
   */
  toggleInputFooter(disable: boolean) {
    this.inputDisabled = disable;
  }

  /**
   * Changes the theme to the current theme given in the theme service for all exising objects in messageObjects list.
   */
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

        element.messageLayout.timeStamp.color = invertColor(
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

        element.messageLayout.timeStamp.color = invertColor(
          returnColorForAnswers(currentTheme, true)
        );
      }
    });
    console.log(this.themeSerivce.getCurrentTheme());
  }

  /**
   * Called from Html. Handles the confirmation of choices for the pop-up texts for multiplce choices.
   * In core creates a pop-up and defines the conditions for accept and decline buttons.
   * @param event Event
   * @param choiceObj ChoiceObject
   */
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
        this.disableAllChoiceButtons();
        this.ref.detectChanges();
        let answer: string;
        if (
          choiceObj.event.includes('appointment_is_available') ||
          choiceObj.event.includes('event_appointment_is_available_decline')
        ) {
          answer = choiceObj.isFallback
            ? 'None of these timeslots fit my scedule.'
            : `Yes the timslot ${choiceObj.label} fits for me!`;
        } else {
          answer = choiceObj.isFallback
            ? 'I do not have any of the mentioned symptoms'
            : `My concern also contains ${choiceObj.label}`;
        }
        this.createMessage(answer, false);
        this.showIsTyping = true;
        let eventExtendedWithSymptom = choiceObj.event;
        if (!choiceObj.isFallback) {
          eventExtendedWithSymptom = choiceObj.event + '#' + choiceObj.label;
        }
        const response =
          await this.communicationService.triggerEventInDialogFlow(
            eventExtendedWithSymptom
          );
        if (response != null) {
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
          if (
            response.isReminderForPatient != null &&
            response.isReminderForPatient
          ) {
            this.createWarnMessage('');
          }
        } else {
          this.createErrorMessage(
            'Oops something went wrong. Please reload the website!'
          );
        }
        this.showIsTyping = false;
        if (
          response != null &&
          response.isEndMessage != null &&
          response.isEndMessage == true
        ) {
          this.endConversation();
        } else {
          this.INPUT_setInputFieldstatus();
        }
      },
      reject: () => {
        //
      },
    };

    this.confirmationService.confirm(confirmation);
  }

  /**
   * Changes Theme for all Messages and inside the service.
   * @param theme string
   */
  changeTheme(theme: string) {
    this.themeSerivce.switchTheme(theme);
    this.changeThemeForExistingMessages();
  }

  /**
   * Changes Size of Component
   * @param size number
   */
  changeSizeOfComponent(size: number) {
    const zoomlevel = `zoom: ${size}`;
    this.mainWindowContainer = zoomlevel;
    this.confirmPopup = `${size}`;
  }

  /**
   * Called from Menu. Creates a pop-up for terms of use information for the user.
   */
  createTermsOfUsePopUp() {
    const termsOfUse: Confirmation = {
      acceptVisible: false,
      target: this.menuButton.nativeElement,
      rejectLabel: 'Close',
      icon: 'pi pi-info-circle',
      message: `By agreeing to the terms of use (typing and sending a message) you argee: 
      1. that we can save the in the chat mentioned information about yourself and use them for the purpose of appointment booking. 
      2. Consequently the information is also saved on servers of the respective doctors office. 
      3. Furthermore you also agree with the Terms of Google DialogFlow (See menu!) 
      DISCAIMER: If you don't agree with our terms, you should not use our chatbot!`,
      reject: () => {
        //
      },
    };
    this.confirmationService.confirm(termsOfUse);
  }

  /**
   * Called from Menu. Creates a pop-up for terms of use information for the user.
   */
  createTermsOfUseGooglePopUp() {
    const termsOfUse: Confirmation = {
      acceptVisible: false,
      target: this.menuButton.nativeElement,
      rejectLabel: 'Close',
      icon: 'pi pi-google',
      message: `Since this chatbot uses Googles DialogFlow to process Information, 
      with the agreement of our terms you also agree with 
      the terms of Google. In short you agree that Google uses the data to train their AI Algorithm and also
      our adaption of AI for our dialog. These can be viewed under this link: 
      https://cloud.google.com/dialogflow/
      docs/data-logging-terms?hl=de`,
      reject: () => {
        //
      },
    };
    this.confirmationService.confirm(termsOfUse);
  }

  /**
   * Creates the slide menu located inside the windows header.
   */
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
        items: [
          {
            label: 'General Information',
            icon: 'pi pi-question',
            command: () => {
              this.createTermsOfUsePopUp();
            },
          },
          {
            label: 'Google Terms',
            icon: 'pi pi-google',
            command: () => {
              this.createTermsOfUseGooglePopUp();
            },
          },
        ],
      },
    ];
  }
}
