import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  baseServerUrl = 'http://localhost:4245/';

  constructor(private http: HttpClient) { }


  sendMessageToServer(messageContent:string){
    this.http.post<any[]>(`${this.baseServerUrl}sendMessage`,{message: messageContent}).subscribe(next => console.log(next));
  }
}
