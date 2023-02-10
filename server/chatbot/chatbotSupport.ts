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
}

export enum ChoiceLevel {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
}
