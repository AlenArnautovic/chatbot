export interface choiceServerObject{
    label: string;
    event: string;
    description: string;
    isFallback: boolean;
}

export interface choiceContainer{
    choices: choiceServerObject[];
}

export interface chatbotTransportObject{
    fulfillmentText: string;
    isMultipleChoice:boolean;
    choiceContainer?:choiceContainer;
}