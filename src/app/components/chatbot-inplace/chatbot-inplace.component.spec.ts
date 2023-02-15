import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotInplaceComponent } from './chatbot-inplace.component';

describe('ChatbotInplaceComponent', () => {
  let component: ChatbotInplaceComponent;
  let fixture: ComponentFixture<ChatbotInplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatbotInplaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotInplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
