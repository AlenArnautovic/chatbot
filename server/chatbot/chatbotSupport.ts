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
  HEADACHE = 'headache',
}

export enum DialogEvents {
  AMBULANCE_EXIT = 'ambulance_exit',
  CALL_DOCTOR_ASAP = 'call_doctor_asap',
  BOOK_APPOINTMENT_ASK = 'book_appointment_ask',
  EVENT_CHOICE_ORANGE = 'event_choice_orange',
  EVENT_CHOICE_YELLOW = 'event_choice_yellow',
  EVENT_CHOICE_GREEN = 'event_choice_green',
  EVENT_ASK_WHO_IS_ILL = 'event_ask_who_is_ill',
  EVENT_SELECTED_ILLNESS_NOT_THERE = 'event_selected_illness_not_there',
  EVENT_BOOK_APPOINTMENT_RELATED_ASK = 'event_book_appointment_related_ask',
}

export enum ChoiceLevel {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
}
