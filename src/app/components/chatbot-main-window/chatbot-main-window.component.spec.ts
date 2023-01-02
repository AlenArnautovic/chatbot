import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotMainWindowComponent } from './chatbot-main-window.component';

describe('ChatbotMainWindowComponent', () => {
  let component: ChatbotMainWindowComponent;
  let fixture: ComponentFixture<ChatbotMainWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatbotMainWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotMainWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
