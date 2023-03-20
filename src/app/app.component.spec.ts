import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { ChatbotInplaceComponent } from './components/chatbot-inplace/chatbot-inplace.component';
import { MessageService } from 'primeng/api';
import { CommunicationService } from './services/communication/communication.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  const mockCommunicationSerivce: any = {
    registerClient() {
      return null;
    },
    createDatabase() {
      return null;
    },
    insertTestData() {
      return null;
    },
    testDatabase() {
      return null;
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, ChatbotInplaceComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        HttpClient,
        HttpHandler,
        MessageService,
        { provide: CommunicationService, useValue: mockCommunicationSerivce },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('METHOD: fillTestData(), TARGET: should call communication service , OUTCOME: none specific', () => {
    const spy = spyOn(mockCommunicationSerivce, 'insertTestData');
    app.fillTestData();
    expect(spy).toHaveBeenCalled();
  });

  it('METHOD: setUpDatabase(), TARGET: should call communication service, OUTCOME: none specific', () => {
    const spy = spyOn(mockCommunicationSerivce, 'createDatabase');
    app.setUpDatabase();
    expect(spy).toHaveBeenCalled();
  });

  it('METHOD: testDataBase(), TARGET: should call message service, OUTCOME: none specific', () => {
    const spy = spyOn(MessageService.prototype, 'add');
    app.testDataBase();
    expect(spy).toHaveBeenCalled();
  });
});
