import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MessageObject } from 'src/app/components/chatbot-main-window/chatbotMainSupport';
import { EncryptionService } from '../encryption/encryption.service';
import { chatbotTransportObject } from './communicationHelper';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  baseServerUrl = 'http://localhost:4245/';
  clientId = 0;
  private messageObjects: MessageObject[] = [];

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) {}

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
  ): Promise<chatbotTransportObject | null> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.baseServerUrl}dialogflow/sendMessage`, {
          message: this.encryptionService.encrypt(messageContent),
          userId: this.encryptionService.encrypt(this.getClientId()),
        })
      );
      const transportObject = this.encryptionService.decrypt(response.answer);
      const answer = JSON.parse(transportObject);
      return answer;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async triggerEventInDialogFlow(
    eventName: string
  ): Promise<chatbotTransportObject | null> {
    try {
      const response: any = (await firstValueFrom(
        this.http.post(`${this.baseServerUrl}dialogflow/eventRequest`, {
          message: this.encryptionService.encrypt(eventName),
          userId: this.encryptionService.encrypt(this.getClientId()),
        })
      )) as any;
      const transportObject = this.encryptionService.decrypt(response.answer);
      const answer = JSON.parse(transportObject);
      return answer;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async registerClient(): Promise<void> {
    const response: any = await firstValueFrom(
      this.http.get(`${this.baseServerUrl}registerClient`, {})
    );
    this.clientId = this.encryptionService.decrypt(response.clientId);
  }

  async createDatabase() {
    await firstValueFrom(
      this.http.post(`${this.baseServerUrl}database/createDatabase`, {})
    );
  }

  async insertTestData() {
    await firstValueFrom(
      this.http.post(`${this.baseServerUrl}database/insertTestData`, {})
    );
  }

  async testDatabase() {
    /**
     * Message keys for testDatabase methods:
     *
     * 1:checkPatientsData
     * 2:checkIfPatientHasAppointmentForDisease
     * 3:checkIfDoctorForDiseaseIsAvailableForASpecificAppointment
     * 4:bookAppointment
     * 5:addPatient
     * 6:checkIfAppointmentForDiseaseIsAvailable
     *
     * To Modify the values that are used for testing the methods please change visit the server.routes.ts class
     */
    await firstValueFrom(
      this.http.post(`${this.baseServerUrl}database/testDatabase`, {
        message: 1,
      })
    );
  }
}
