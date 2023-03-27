/**
 * by Nicolai Haferkamp
 */
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
  isReminderForPatient?: boolean;
  isEndMessage?: boolean;
}

export enum Diseases {
  BACKPAIN = 'Back Pain',
  EAR_PROBLEMS = 'Ear Problem',
  EYE_PROBLEMS = 'Eye Problem',
  SORE_THROAT = 'Sore Throat',
  HEADACHE = 'Headache',
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
  EVENT_PATIENT_HAS_APPOINTMENT = 'patient_has_appointment',
  EVENT_ASK_FOR_APPOINTMENT = 'event_appointment_ask_date',

  EVENT_APPOINTMENT_IS_AVAILABLE = 'appointment_is_available',
  EVENT_APPOINTMENT_NOT_AVAILABLE = 'appointment_not_available',
  EVENT_APPOINTMENT_IS_AVAILABLE_DECLINE = 'event_appointment_is_available_decline',
  EVENT_RESET_CONTEXTS = 'event_reset_contexts',
}

export enum ChoiceLevel {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
}

export interface timeObject {
  date: string;
  time: string;
}
