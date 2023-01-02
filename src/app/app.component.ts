import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatbot';

  baseServerUrl = 'http://localhost:4245/'

  constructor(private http: HttpClient){

  }

  /**Test method */
  sendRequest(){
    this.http.post<any[]>(`${this.baseServerUrl}sendMessage`,{message: 'Hello my name is'}).subscribe(next => console.log(next));
  }


}
