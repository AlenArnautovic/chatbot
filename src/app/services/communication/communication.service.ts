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
  async getPatientsFromDatabase(
    messageContent: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.get(`${this.baseServerUrl}database/getPatient`, {})
    )) as chatbotTransportObject;
    return response;
  }

  async createDatabase(): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(`${this.baseServerUrl}database/createDatabase`, {
        userId: this.getClientId(),
      })
    )) as chatbotTransportObject;
    return response;
  }

  async insertTestData(): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(`${this.baseServerUrl}database/insertTestData`, {
        userId: this.getClientId(),
      })
    )) as chatbotTransportObject;
    return response;
  }

  async checkPatientsData(
    birthdate: string,
    prename: string,
    lastname: string,
    vNumber: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(`${this.baseServerUrl}database/checkPatientsData`, {
        birthdate,
        prename,
        lastname,
        vNumber,
        userId: this.getClientId(),
      })
    )) as chatbotTransportObject;
    return response;
  }

  async checkIfPatientHasAppointmentForDisease(
    vNumber: string,
    disease: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(
        `${this.baseServerUrl}database/checkIfPatientHasAppointmentForDisease`,
        {
          vNumber,
          disease,
          userId: this.getClientId(),
        }
      )
    )) as chatbotTransportObject;
    return response;
  }

  async checkIfPatientHasAppointmentAtTime(
    vNumber: string,
    appointment: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(
        `${this.baseServerUrl}database/checkIfPatientHasAppointmentAtTime`,
        {
          vNumber,
          appointment,
          userId: this.getClientId(),
        }
      )
    )) as chatbotTransportObject;
    return response;
  }

  async checkIfDoctorForDiseaseIsAvailable(
    disease: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(
        `${this.baseServerUrl}database/checkIfDoctorForDiseaseIsAvailable`,
        {
          disease,
          userId: this.getClientId(),
        }
      )
    )) as chatbotTransportObject;
    return response;
  }

  async checkIfDoctorForDiseaseIsAvailableForASpecificAppointment(
    disease: string,
    appointment: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(
        `${this.baseServerUrl}database/checkIfDoctorForDiseaseIsAvailableForASpecificAppointment`,
        {
          disease,
          appointment,
          userId: this.getClientId(),
        }
      )
    )) as chatbotTransportObject;
    return response;
  }

  async getInformationOfAppointment(
    vNumber: string,
    appointment: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(
        `${this.baseServerUrl}database/getInformationOfAppointment`,
        {
          vNumber,
          appointment,
          userId: this.getClientId(),
        }
      )
    )) as chatbotTransportObject;
    return response;
  }

  async bookAppointment(
    vNumber: string,
    appointment: string,
    disease: string,
    symptoms: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(`${this.baseServerUrl}database/bookAppointment`, {
        vNumber,
        appointment,
        disease,
        symptoms,
        userId: this.getClientId(),
      })
    )) as chatbotTransportObject;
    return response;
  }

  async changeAppointment(
    vNumber: string,
    disease: string,
    oldAppointment: string,
    newAppointment: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(`${this.baseServerUrl}database/changeAppointment`, {
        vNumber,
        disease,
        oldAppointment,
        newAppointment,
        userId: this.getClientId(),
      })
    )) as chatbotTransportObject;
    return response;
  }

  async deleteAppointment(
    vNumber: string,
    appointment: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(`${this.baseServerUrl}database/deleteAppointment`, {
        vNumber,
        appointment,
        userId: this.getClientId(),
      })
    )) as chatbotTransportObject;
    return response;
  }

  async addPatient(
    vNumber: string,
    preName: string,
    lastName: string,
    phone: string,
    birthdate: string,
    address_ID: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(`${this.baseServerUrl}database/addPatient`, {
        vNumber,
        preName,
        lastName,
        phone,
        birthdate,
        address_ID,
        userId: this.getClientId(),
      })
    )) as chatbotTransportObject;
    return response;
  }

  async checkIfAppointmentForDiseaseIsAvailable(
    disease: string,
    appointment: string
  ): Promise<chatbotTransportObject> {
    const response: chatbotTransportObject = (await firstValueFrom(
      this.http.post(
        `${this.baseServerUrl}database/checkIfAppointmentForDiseaseIsAvailable`,
        {
          disease,
          appointment,
          userId: this.getClientId(),
        }
      )
    )) as chatbotTransportObject;
    return response;
  }
  
}
