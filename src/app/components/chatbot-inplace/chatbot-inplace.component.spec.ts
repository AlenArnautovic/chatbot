import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Inplace } from 'primeng/inplace';

import { ChatbotInplaceComponent } from './chatbot-inplace.component';

/**
 * by Nicolai Haferkamp
 */
describe('ChatbotInplaceComponent', () => {
  let component: ChatbotInplaceComponent;
  let fixture: ComponentFixture<ChatbotInplaceComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatbotInplaceComponent, Inplace],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [HttpClient, HttpHandler],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotInplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('METHOD: receiveMessage(), TARGET: should call deactivate , OUTCOME: none specific', () => {
    const spy = spyOn(component.inplaceElement, 'deactivate');
    component.receiveMessage('closeWindow');
    expect(spy).toHaveBeenCalled();
  });
});
