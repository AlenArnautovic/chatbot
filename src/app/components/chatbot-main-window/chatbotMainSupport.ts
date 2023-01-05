import { messageTypes } from "./messageTypes";

export interface MessageObject{
    content:string;
    messageLayout:MessageLayout;

}

export interface MessageLayout{
    position: string;
    backgroundColor: string;
    textColor: string;
    messageType:messageTypes;
}

export const rightMessageLayout:MessageLayout = {
    position: 'flex justify-content-end',
    backgroundColor: '',
    textColor:'',
    messageType: messageTypes.question
}

export const leftMessageLayout: MessageLayout = {
    position: 'flex',
    backgroundColor: '',
    textColor:'',
    messageType: messageTypes.answer
}

