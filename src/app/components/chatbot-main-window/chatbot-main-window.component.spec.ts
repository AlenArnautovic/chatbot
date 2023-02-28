import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { CommunicationService } from 'src/app/services/communication/communication.service';

import { ChatbotMainWindowComponent } from './chatbot-main-window.component';
import { ChoiceObject } from './chatbotMainSupport';
import { messageTypes } from './messageTypes';

describe('ChatbotMainWindowComponent', () => {
  let component: ChatbotMainWindowComponent;
  let fixture: ComponentFixture<ChatbotMainWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatbotMainWindowComponent],
      providers: [
        HttpClient,
        HttpHandler,
        CommunicationService,
        ConfirmationService,
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

  it('METHOD: createMessage(), TODO: create message based on given info, OUTCOME: messageObjects.length ==1', () => {
    const content = 'Hello';
    const isAnswer = true;
    component.createMessage(content, isAnswer);
    expect(component.messageObjects.length).toBe(1);
  });

  it('METHOD: createMessage(), TODO: create message with right content, OUTCOME: content == hello & messageType == answer', () => {
    const content = 'Hello';
    const isAnswer = true;
    component.createMessage(content, isAnswer);
    expect(component.messageObjects.length).toBe(1);
    expect(component.messageObjects[0].content).toBe(content);
    expect(component.messageObjects[0].messageLayout.messageType).toBe(
      messageTypes.answer
    );
  });

  it('METHOD: createMessage(), TODO: create the right message, OUTCOME: messageType == question', () => {
    const content = 'Hello';
    const isAnswer = false;
    component.createMessage(content, isAnswer);
    expect(component.messageObjects.length).toBe(1);
    expect(component.messageObjects[0].content).toBe(content);
    expect(component.messageObjects[0].messageLayout.messageType).toBe(
      messageTypes.question
    );
  });

  it('METHOD: createMultipleChoice(), TODO: create multiple choice based on given info, OUTCOME: messageObjects.length ==1 & messageObjects.isMultipleChoice', () => {
    const choiceObjects: ChoiceObject = {
      label: 'text123',
      event: 'TEST_EVENT',
      description: 'test123',
      isFallback: false,
      symbolClass: 'Symbol_Test',
    };

    component.createMultipleChoice([choiceObjects]);
    expect(component.messageObjects.length).toBe(1);
    expect(component.messageObjects[0].isMultipleChoice).toBe(true);
  });

  it('METHOD: createMultipleChoice(), TODO: create multiple choice with right information, OUTCOME: choiceObjects.length == 1 & label == text123 ', () => {
    const choiceObjects: ChoiceObject = {
      label: 'text123',
      event: 'TEST_EVENT',
      description: 'test123',
      isFallback: false,
      symbolClass: 'Symbol_Test',
    };

    component.createMultipleChoice([choiceObjects]);
    expect(component.messageObjects.length).toBe(1);
    expect(component.messageObjects[0].choiceObjects.length).toBe(1);
    expect(component.messageObjects[0].choiceObjects[0].label).toBe('text123');
  });

  it('METHOD: createMultipleChoice(), TODO: should set inputfield parameters to right values, OUTCOME: showIsTyping == false & inputFieldValue == empty & inputPlaceHolder == Choose an Option...', () => {
    const choiceObjects: ChoiceObject = {
      label: 'text123',
      event: 'TEST_EVENT',
      description: 'test123',
      isFallback: false,
      symbolClass: 'Symbol_Test',
    };

    component.createMultipleChoice([choiceObjects]);
    expect(component.showIsTyping).toBe(false);
    expect(component.inputFieldValue).toBe('');
    expect(component.inputPlaceholder).toBe('Choose an Option...');
  });

  it('METHOD: INPUT_setInputFieldstatus(), TODO: should set inputfield values when empty, OUTCOME: inputPlaceHolder == Say Hi... & inputDisabled == false', () => {
    component.INPUT_setInputFieldstatus();
    expect(component.inputDisabled).toBe(false);
    expect(component.inputPlaceholder).toBe('Say Hi...');
  });

  it('METHOD: INPUT_setInputFieldstatus(), TODO: should set inputfield values when message, OUTCOME: inputPlaceHolder == Type Here... & inputDisabled == false', () => {
    const content = 'Hello';
    const isAnswer = true;
    component.createMessage(content, isAnswer);
    component.INPUT_setInputFieldstatus();
    expect(component.inputDisabled).toBe(false);
    expect(component.inputPlaceholder).toBe('Type Here...');
  });
});
