export interface choiceServerObject {
  label: string;
  event: string;
  description: string;
  isFallback: boolean;
}

export interface choiceContainer {
  choices: choiceServerObject[];
}

export interface chatbotTransportObject {
  isError: boolean;
  errorMessage?: string;
  fulfillmentText: string;
  isMultipleChoice: boolean;
  choiceContainer?: choiceContainer;
}

export enum Diseases {
  BACKPAIN = 'backpain',
  EAR_PROBLEMS = 'ear-problems',
  EYE_PROBLEMS = 'eye-problems',
  SORE_THROAT = 'sore-throat',
}

export enum DialogEvents {
  AMBULANCE_EXIT = 'ambulance_exit',
  CALL_DOCTOR_ASAP = 'call_doctor_asap',
  BOOK_APPOINTMENT_ASK = 'book_appointment_ask',
}

export enum ChoiceLevel {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
}
