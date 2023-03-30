import { messageTypes } from './messageTypes';

/**
 * by Nicolai Haferkamp
 */
export interface MessageObject {
  content: string;
  messageLayout: MessageLayout;
  choiceObjects: ChoiceObject[];
  isMultipleChoice: boolean;
  isLastMessage?: boolean;
}

export interface MessageLayout {
  position: string;
  backgroundColor: string;
  textColor: string;
  messageType: messageTypes;
  disabled: boolean;
  timeStamp: timeStamp;
}
export interface timeStamp {
  value: string;
  color: string;
  hidden: boolean;
}
export interface ChoiceObject {
  label: string;
  event: string;
  description: string;
  isFallback: boolean;
  symbolClass: string;
}
export const timeStampPlaceholder: timeStamp = {
  value: '',
  color: '',
  hidden: true,
};
export const rightMessageLayout: MessageLayout = {
  position: 'flex justify-content-end',
  backgroundColor: '',
  textColor: '',
  messageType: messageTypes.question,
  disabled: false,
  timeStamp: timeStampPlaceholder,
};

export const leftMessageLayout: MessageLayout = {
  position: 'flex',
  backgroundColor: '',
  textColor: '',
  messageType: messageTypes.answer,
  disabled: false,
  timeStamp: timeStampPlaceholder,
};

export const multipleChoiceLayout: MessageLayout = {
  position: 'flex',
  backgroundColor: '',
  textColor: '',
  messageType: messageTypes.multipleChoice,
  disabled: false,
  timeStamp: timeStampPlaceholder,
};
