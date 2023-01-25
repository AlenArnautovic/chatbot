import { messageTypes } from "./messageTypes";

export interface MessageObject{
    content: string;
    messageLayout: MessageLayout;
    choiceObjects: ChoiceObject[];
    isMultipleChoice:boolean;
}

export interface MessageLayout{
    position: string;
    backgroundColor: string;
    textColor: string;
    messageType:messageTypes;
    disabled: boolean;

}

export interface ChoiceObject{
    label: string;
    event: string;
    description: string;
    isFallback: boolean;
    symbolClass: string;
}

export const rightMessageLayout:MessageLayout = {
    position: 'flex justify-content-end',
    backgroundColor: '',
    textColor:'',
    messageType: messageTypes.question,
    disabled:false
}

export const leftMessageLayout: MessageLayout = {
    position: 'flex',
    backgroundColor: '',
    textColor:'',
    messageType: messageTypes.answer,
    disabled:false
}

export const multipleChoiceLayout: MessageLayout = {
    position: 'flex',
    backgroundColor: '',
    textColor: '',
    messageType: messageTypes.multipleChoice,
    disabled:false
}

