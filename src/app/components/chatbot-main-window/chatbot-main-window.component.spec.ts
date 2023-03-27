import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { CommunicationService } from 'src/app/services/communication/communication.service';
import {
  chatbotTransportObject,
  choiceServerObject,
} from 'src/app/services/communication/communicationHelper';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { ChatbotMainWindowComponent } from './chatbot-main-window.component';
import {
  ChoiceObject,
  leftMessageLayout,
  MessageObject,
} from './chatbotMainSupport';
import {
  invertColor,
  returnColorForAnswers,
  returnColorForQuestions,
} from './colorHelper';
import { messageTypes } from './messageTypes';

/**
 * by Nicolai Haferkamp
 */
describe('ChatbotMainWindowComponent', () => {
  let component: ChatbotMainWindowComponent;
  let fixture: ComponentFixture<ChatbotMainWindowComponent>;

  const mockMessageService: any = {
    add() {
      return null;
    },
  };

  const mockConfirmationService: any = {
    confirm(termsOfUse: Confirmation) {
      return null;
    },
  };

  const mockCommunicationSerivce: any = {
    sendMessageToDialogFlow(message: string) {
      const obj: chatbotTransportObject = {
        isError: false,
        fulfillmentText: 'Response123',
        isMultipleChoice: true,
      };
      return obj;
    },

    getSavedMessages(): MessageObject[] {
      return [];
    },
    saveMessages(obj: any) {
      return null;
    },
    triggerEventInDialogFlow(value: string) {
      return null;
    },
  };

  const mockThemeService: any = {
    switchTheme(theme: string) {
      return null;
    },
    getCurrentTheme() {
      return 'lara-dark-purple';
    },
  };

  const choiceObjects: ChoiceObject = {
    label: 'text123',
    event: 'TEST_EVENT',
    description: 'test123',
    isFallback: false,
    symbolClass: 'Symbol_Test',
  };
  const choiceObjects2: ChoiceObject = {
    label: 'text1234',
    event: 'TEST_EVENT',
    description: 'test1234',
    isFallback: false,
    symbolClass: 'Symbol_Test',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatbotMainWindowComponent],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: CommunicationService, useValue: mockCommunicationSerivce },
        ConfirmationService,
        { provide: MessageService, useValue: mockMessageService },
        { provide: ThemeService, useValue: mockThemeService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotMainWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.messageObjects = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('METHOD: createMessage(), TARGET: create message based on given info, OUTCOME: messageObjects.length ==1', () => {
    const content = 'Hello';
    const isAnswer = true;
    component.createMessage(content, isAnswer);
    expect(component.messageObjects.length).toBe(1);
  });

  it('METHOD: createMessage(), TARGET: create message with right content, OUTCOME: content == hello & messageType == answer', () => {
    const content = 'Hello';
    const isAnswer = true;
    component.createMessage(content, isAnswer);
    expect(component.messageObjects.length).toBe(1);
    expect(component.messageObjects[0].content).toBe(content);
    expect(component.messageObjects[0].messageLayout.messageType).toBe(
      messageTypes.answer
    );
  });

  it('METHOD: createMessage(), TARGET: create a question message in the message list, OUTCOME: messageType == question', () => {
    const content = 'Hello';
    const isAnswer = false;
    component.createMessage(content, isAnswer);
    expect(component.messageObjects.length).toBe(1);
    expect(component.messageObjects[0].content).toBe(content);
    expect(component.messageObjects[0].messageLayout.messageType).toBe(
      messageTypes.question
    );
  });

  it('METHOD: createMultipleChoice(), TARGET: create multiple choice based on given info, OUTCOME: messageObjects.length ==1 & messageObjects.isMultipleChoice', () => {
    component.createMultipleChoice([choiceObjects]);
    expect(component.messageObjects.length).toBe(1);
    expect(component.messageObjects[0].isMultipleChoice).toBe(true);
  });

  it('METHOD: createMultipleChoice(), TARGET: create multiple choice with right information, OUTCOME: choiceObjects.length == 1 & label == text123 ', () => {
    component.createMultipleChoice([choiceObjects]);
    expect(component.messageObjects.length).toBe(1);
    expect(component.messageObjects[0].choiceObjects.length).toBe(1);
    expect(component.messageObjects[0].choiceObjects[0].label).toBe('text123');
  });

  it('METHOD: createMultipleChoice(), TARGET: should set inputfield parameters to right values, OUTCOME: showIsTyping == false & inputFieldValue == empty & inputPlaceHolder == Choose an Option...', () => {
    component.createMultipleChoice([choiceObjects]);
    expect(component.showIsTyping).toBe(false);
    expect(component.inputFieldValue).toBe('');
    expect(component.inputPlaceholder).toBe('Choose an Option...');
  });

  it('METHOD: INPUT_setInputFieldstatus(), TARGET: should set inputfield values when empty, OUTCOME: inputPlaceHolder == Say Hi... & inputDisabled == false', () => {
    component.INPUT_setInputFieldstatus();
    expect(component.inputDisabled).toBe(false);
    expect(component.inputPlaceholder).toBe('Say Hi...');
  });

  it('METHOD: INPUT_setInputFieldstatus(), TARGET: should set inputfield values when message, OUTCOME: inputPlaceHolder == Type Here... & inputDisabled == false', () => {
    const content = 'Hello';
    const isAnswer = true;
    component.createMessage(content, isAnswer);
    component.INPUT_setInputFieldstatus();
    expect(component.inputDisabled).toBe(false);
    expect(component.inputPlaceholder).toBe('Type Here...');
  });

  it('METHOD: disableAllChoiceButtons(), TARGET: should not return error when messages are emtpy, OUTCOME: None specific ', () => {
    const spy = spyOn(component, 'disableAllChoiceButtons');
    component.disableAllChoiceButtons();
    expect(spy).toHaveBeenCalled();
  });

  it('METHOD: disableAllChoiceButtons(), TARGET: should disable existing choice options, OUTCOME: messageObject.messageLayout.disabled = true ', () => {
    component.createMultipleChoice([choiceObjects, choiceObjects2]);
    component.disableAllChoiceButtons();
    let isFalsey = false;
    component.messageObjects.forEach((element) => {
      if (!element.messageLayout.disabled) {
        isFalsey = true;
      }
    });
    expect(isFalsey).toBe(false);
  });

  it('METHOD: createErrorMessage(), TARGET: should call message function, OUTCOME: None specific ', () => {
    const spy = spyOn(component, 'createErrorMessage');
    component.createErrorMessage('test123');
    expect(spy).toHaveBeenCalled();
  });

  it('METHOD: onSendMessage(), TARGET: should not send message, OUTCOME: None specific ', () => {
    const content = '';
    component.inputFieldValue = content;
    const spy = spyOn(mockCommunicationSerivce, 'sendMessageToDialogFlow');
    component.onSendMessage();
    expect(component.messageObjects.length).toBe(0);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('METHOD: onSendMessage(), TARGET: should send message, OUTCOME: None specific ', () => {
    const content = 'Hello';
    component.inputFieldValue = content;
    const spy = spyOn(mockCommunicationSerivce, 'sendMessageToDialogFlow');
    component.onSendMessage();
    expect(component.messageObjects[0].content).toBe(content);
    expect(component.messageObjects.length).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('METHOD: changeTheme() and changeThemeForExistingMessages(), TARGET: should change theme for messages, OUTCOME: None specific', () => {
    const textTheme = 'lara-dark-purple';
    const content = 'Hello';
    const isAnswer = true;
    component.createMessage(content, isAnswer);
    const contentN = 'Hello Back';
    const isAnswerN = false;
    component.createMessage(contentN, isAnswerN);
    component.changeTheme('test123');
    let isFalsey = false;
    component.messageObjects.forEach((element) => {
      if (element.messageLayout.messageType == messageTypes.answer) {
        if (
          element.messageLayout.backgroundColor !=
          returnColorForAnswers(textTheme, false)
        ) {
          isFalsey = true;
        }
      } else {
        if (
          element.messageLayout.backgroundColor !=
          returnColorForQuestions(textTheme, false)
        ) {
          isFalsey = true;
        }
      }
    });
    expect(isFalsey).toBe(false);
  });

  it('METHOD: createMenu(), TARGET: should call message function, OUTCOME: None specific ', () => {
    const spy = spyOn(component, 'createMenu');
    component.createMenu();
    expect(spy).toHaveBeenCalled();
  });

  it('METHOD: createTermsOfUsePopUp(), TARGET: should call message function, OUTCOME: None specific ', () => {
    const spy = spyOn(component, 'createTermsOfUsePopUp');
    component.createTermsOfUsePopUp();
    expect(spy).toHaveBeenCalled();
  });

  it('METHOD: createTermsOfUseGooglePopUp(), TARGET: should call message function, OUTCOME: None specific ', () => {
    const spy = spyOn(component, 'createTermsOfUseGooglePopUp');
    component.createTermsOfUseGooglePopUp();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('METHOD: changeSizeOfComponent(), TARGET: change size inside variables, OUTCOME: size == 1.2 ', () => {
    const size = 1.2;
    component.changeSizeOfComponent(size);
    expect(component.mainWindowContainer).toEqual(`zoom: ${size}`);
    expect(component.confirmPopup).toEqual(`${size}`);
  });

  it('METHOD: setMessageTimeStamp(), TARGET: set the right timestamp for messages, OUTCOME: color == #FFFFF & value.lenght == 5', () => {
    const color = '#FFFFF';
    const message: MessageObject = {
      content: 'Hello',
      messageLayout: leftMessageLayout,
      choiceObjects: [],
      isMultipleChoice: false,
    };
    component.setMessageTimeStamp(color, message);
    expect(message.messageLayout.timeStamp.color).toEqual(color);
    expect(message.messageLayout.timeStamp.value.length).toBe(5);
  });

  it('METHOD: transformServerMultipleChoice(), TARGET: change size inside variables, OUTCOME: none specific', () => {
    const content = 'Test123';
    const serverObj: choiceServerObject = {
      label: content,
      event: content,
      description: content,
      isFallback: false,
    };
    const result = component.transformServerMultipleChoice([serverObj]);
    expect(result.length).toBe(1);
    expect(result[0].label).toEqual(content);
    expect(result[0].event).toEqual(content);
    expect(result[0].description).toEqual(content);
    expect(result[0].isFallback).toEqual(false);
  });

  it('METHOD: ngAfterViewInit(), TARGET: should initialize the window with right values, OUTCOME: none Specific', () => {
    component.ngAfterViewInit();
    expect(component.inputPlaceholder).toEqual('Say Hi...');
    expect(component.messageObjects.length).toBe(0);
  });

  it('METHOD: toggleInputFooter(), TARGET: should disable input footer, OUTCOME: inputDisabled == true', () => {
    component.toggleInputFooter(true);
    expect(component.inputDisabled).toBe(true);
  });

  it('METHOD: invertColor(), TARGET: should not accept nox hex color, OUTCOME: none specific', () => {
    let errorE = null;
    try {
      invertColor('test123');
    } catch (error) {
      errorE = error;
    }
    expect(errorE).toBeDefined;
  });

  it('METHOD: returnColorForAnswers(), TARGET: should not return anything, OUTCOME: return == emtpy', () => {
    const returnValue = returnColorForAnswers('test123', false);
    expect(returnValue).toBe('');
  });

  it('METHOD: returnColorForAnswers(), TARGET: should return a value length above 1, OUTCOME: return.length > 1', () => {
    const returnValue = returnColorForAnswers('test123-light', false);
    expect(returnValue.length).toBeGreaterThan(1);
  });

  it('METHOD: returnColorForQuestions(), TARGET: should not return anything, OUTCOME: return == emtpy', () => {
    const returnValue = returnColorForAnswers('test123', false);
    expect(returnValue).toBe('');
  });

  it('METHOD: returnColorForQuestions(), TARGET: should return a value length above 1, OUTCOME: return.length > 1', () => {
    const returnValue = returnColorForAnswers('lara-light-purple', false);
    expect(returnValue.length).toBeGreaterThan(1);
  });

  it('METHOD: closeWindow(), TARGET: should call method to save messages when component is closed, OUTCOME: none specific', () => {
    const spy = spyOn(mockCommunicationSerivce, 'saveMessages');
    component.closeWindow();
    expect(spy).toHaveBeenCalled();
  });

  it('METHOD: confirmChoice(), TARGET: should call confirm, OUTCOME: none Specific', () => {
    const confirmationService: ConfirmationService =
      TestBed.get(ConfirmationService);
    const mockConfirm: any = spyOn(
      ConfirmationService.prototype,
      'confirm'
    ).and.callFake((c: any) => {
      return c.accept();
    });
    const event: any = {
      target: null,
    };
    const choiceObj: ChoiceObject = {
      label: 'Test123',
      event: 'Test123',
      description: 'Test123',
      isFallback: false,
      symbolClass: 'Test123',
    };
    component.confirmChoice(event, choiceObj);
    expect(mockConfirm).toHaveBeenCalled();
  });
});
