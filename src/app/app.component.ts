import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommunicationService } from './services/communication/communication.service';

/**
 * by Nicolai Haferkamp
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'chatbot';

  constructor(
    private communicationService: CommunicationService,
    private messageService: MessageService
  ) {
    //Empty Constructor
  }
  ngOnInit(): void {
    this.communicationService.registerClient();
  }

  /**
   * Database Set Up Method
   */
  setUpDatabase() {
    this.communicationService.createDatabase();
    this.messageService.add({
      severity: 'info',
      summary: 'Database',
      detail: 'Executing create database. Please wait...',
    });
  }

  /**
   * Database Set Up Method
   */
  fillTestData() {
    this.communicationService.insertTestData();
    this.messageService.add({
      severity: 'info',
      summary: 'Database',
      detail: 'Executing insert test data. Please wait...',
    });
  }

  /**
   * Database Test Method
   */
  testDataBase() {
    this.communicationService.testDatabase();
    this.messageService.add({
      severity: 'info',
      summary: 'Database',
      detail:
        'Testing specified database method. Please configure communication service to change the method to test.',
    });
  }
}
