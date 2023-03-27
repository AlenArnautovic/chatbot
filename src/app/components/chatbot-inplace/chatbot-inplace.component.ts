import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Inplace } from 'primeng/inplace';

/**
 * by Nicolai Haferkamp
 */
@Component({
  selector: 'app-chatbot-inplace',
  templateUrl: './chatbot-inplace.component.html',
  styleUrls: ['./chatbot-inplace.component.css'],
})
export class ChatbotInplaceComponent {
  @ViewChild('inplace') inplaceElement!: Inplace;
  avatarBadgeContent = 'Hey!';
  avatarBadgeDisabled = false;
  contentActive = true;
  openButtonDelay = 700;

  constructor(private ref: ChangeDetectorRef) {}

  receiveMessage($event: string) {
    if ($event == 'closeWindow') {
      this.inplaceElement.deactivate();
    }
  }
}
