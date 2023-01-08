import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AiResponse } from './communicationHelper';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  baseServerUrl = 'http://localhost:4245/';

  constructor(private http: HttpClient) { }


  sendMessageToServer(messageContent:string){
    this.http.post<any[]>(`${this.baseServerUrl}sendMessage`,{message: messageContent}).subscribe(next => console.log(next));
  }

  //TODO add new userId method to server that gives every client a unique user id;
  async sendMessageToDialogFlow(messageContent:string):Promise<AiResponse>{
    const response: AiResponse  = await firstValueFrom(this.http.post(`${this.baseServerUrl}dialogflow/sendMessage`,{message: messageContent, userId:'user-1'})) as AiResponse;
    return response;
  }
}
