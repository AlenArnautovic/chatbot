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
