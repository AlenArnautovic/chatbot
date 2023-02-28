import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MessageObject } from 'src/app/components/chatbot-main-window/chatbotMainSupport';
import { chatbotTransportObject } from './communicationHelper';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  baseServerUrl = 'http://localhost:4245/';
  clientId = 0;
  private messageObjects: MessageObject[] = [];

  constructor(private http: HttpClient) {}

  getClientId() {
    return `user-${this.clientId}`;
  }

  saveMessages(messageObjects: MessageObject[]) {
    this.messageObjects = messageObjects;
  }

  getSavedMessages(): MessageObject[] {
    return this.messageObjects;
  }

  //TODO add new userId method to server that gives every client a unique user id;
  async sendMessageToDialogFlow(
    messageContent: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(`${this.baseServerUrl}dialogflow/sendMessage`, {
        message: messageContent,
        userId: this.getClientId(),
      })
    )) as chatbotTransportObject;
    return response;
  }

  //TODO remove, only test method!!
  async sendMessageToDatabase(
    messageContent: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(`${this.baseServerUrl}database/insert`, {
        message: messageContent,
        userId: this.getClientId(),
      })
    )) as chatbotTransportObject;
    return response;
  }

  async triggerEventInDialogFlow(
    eventName: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(`${this.baseServerUrl}dialogflow/eventRequest`, {
        message: eventName,
        userId: this.getClientId(),
      })
    )) as chatbotTransportObject;
    return response;
  }

  async registerClient(): Promise<void> {
    const response: any = await firstValueFrom(
      this.http.get(`${this.baseServerUrl}registerClient`, {})
    );
    this.clientId = response.clientId;
  }
}
