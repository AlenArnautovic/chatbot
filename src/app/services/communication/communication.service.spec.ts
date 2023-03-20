import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CommunicationService } from './communication.service';
import { EncryptionService } from '../encryption/encryption.service';

//https://stackoverflow.com/questions/64748224/how-to-test-http-post-request-with-parameters-in-angular-9
//https://angular.io/guide/http#testing-http-requests
describe('CommunicationService', () => {
  let httpMock: HttpTestingController;
  let service: CommunicationService;
  const encryptionMock: any = {
    encrypt(value: any) {
      return value;
    },
    decrypt(value: any) {
      return value;
    },
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: EncryptionService, useValue: encryptionMock }],
    });
    service = TestBed.inject(CommunicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('METHOD: sendMessageToDialogFlow(), TARGET: should send post request with specified parameters, OUTCOME: method == POST & message == Test123 & userID == user-0', () => {
    const mockUrl = 'http://localhost:4245/dialogflow/sendMessage';
    const mockResponse = {
      message: 'Test123',
      userId: service.getClientId(),
    };
    service.sendMessageToDialogFlow('Test123');
    const request = httpMock.expectOne(mockUrl);
    expect(request.request.method).toEqual('POST');
    expect(request.request.body).toEqual(mockResponse);
    httpMock.verify();
  });

  it('METHOD: triggerEventInDialogFlow(), TARGET: should send post request with specified parameters, OUTCOME: method == POST & message == Test123 & userID == user-0', () => {
    const mockUrl = 'http://localhost:4245/dialogflow/eventRequest';
    const mockResponse = {
      message: 'Test123',
      userId: service.getClientId(),
    };
    service.triggerEventInDialogFlow('Test123');
    const request = httpMock.expectOne(mockUrl);
    expect(request.request.method).toEqual('POST');
    expect(request.request.body).toEqual(mockResponse);
    httpMock.verify();
  });

  it('METHOD: registerClient(), TARGET: should send get request, OUTCOME: method == GET', () => {
    const mockUrl = 'http://localhost:4245/registerClient';
    service.registerClient();
    const request = httpMock.expectOne(mockUrl);
    expect(request.request.method).toEqual('GET');
    httpMock.verify();
  });

  it('METHOD: createDatabase(), TARGET: should send post request, OUTCOME: method == POST', () => {
    const mockUrl = 'http://localhost:4245/database/createDatabase';
    service.createDatabase();
    const request = httpMock.expectOne(mockUrl);
    expect(request.request.method).toEqual('POST');
    httpMock.verify();
  });

  it('METHOD: insertTestData(), TARGET: should send post request, OUTCOME: method == POST', () => {
    const mockUrl = 'http://localhost:4245/database/insertTestData';
    service.insertTestData();
    const request = httpMock.expectOne(mockUrl);
    expect(request.request.method).toEqual('POST');
    httpMock.verify();
  });

  it('METHOD: (), TARGET: should send post request, OUTCOME: method == POST', () => {
    const mockUrl = 'http://localhost:4245/database/testDatabase';
    service.testDatabase();
    const request = httpMock.expectOne(mockUrl);
    expect(request.request.method).toEqual('POST');
    httpMock.verify();
  });
});
