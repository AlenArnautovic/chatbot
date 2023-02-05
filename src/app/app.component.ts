import { Component, OnInit } from '@angular/core';
import { CommunicationService } from './services/communication/communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'chatbot';

  constructor(private communicationService: CommunicationService) {
    //Empty Constructor
  }
  ngOnInit(): void {
    this.communicationService.registerClient();
  }
}
