import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicationService } from '../services/communication/communication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



export class LoginComponent {
  
  constructor(private router : Router, private comm : CommunicationService) {

  }
  patient = 'TestPatient';

  logIn(){
    this.router.navigate(['/']);
    //var url = "localhost";
    this.comm.sendMessageToDatabase("blabla");
  }
}
