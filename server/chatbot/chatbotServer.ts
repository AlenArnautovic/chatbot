import dialogflow from '@google-cloud/dialogflow';
import { google } from '@google-cloud/dialogflow/build/protos/protos';
import e from 'express';
import {v4 as uuid} from 'uuid';
import { chatbotDiseaseStore } from './chatbotDiseaseStore';
import { chatbotTransportObject } from './chatbotSupport';
import { devKeys } from './devKeyConfig';

export class Chatbot{
    
    static projectId = devKeys.googleProjectId;
    static languageCode = devKeys.dialogFlowSessionLanguageCode;

    static sessionId = uuid();
    
    static credts = {
        client_email: devKeys.googleClientEmail,
        private_key: devKeys.googlePrivateKey
    }
    
    static sessionClient = new dialogflow.SessionsClient({projectId:Chatbot.projectId,credentials:Chatbot.credts});
    
    public static textQuery = async(userMessage:string, userId:string)=>{
        const sessionPath = Chatbot.sessionClient.projectAgentSessionPath(Chatbot.projectId,Chatbot.sessionId+userId);
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: userMessage,
                    languageCode: Chatbot.languageCode
                }
            }
        }
    
        try{
            const response = await Chatbot.sessionClient.detectIntent(request);
            return response;
        }catch(error){
            console.log(error);
            return null;
        }
    }

    public static createChatbotTransportObject(response:[google.cloud.dialogflow.v2.IDetectIntentResponse, google.cloud.dialogflow.v2.IDetectIntentRequest,any]):chatbotTransportObject{
        new chatbotDiseaseStore;
        const chatbotTransportObject: chatbotTransportObject = {
            fulfillmentText: '',
            isMultipleChoice: false
        };
        try{
        const intentName = response[0].queryResult.intent.displayName;
        switch(intentName){
            case 'Age_answer_backpain':
                chatbotTransportObject.isMultipleChoice = true;
                chatbotTransportObject.choiceContainer = chatbotDiseaseStore.backpain_red;
                break;
            default: 
                // 
                break;
        }
        }catch(error){
            console.log(error);
        }
        try{
            chatbotTransportObject.fulfillmentText = response[0].queryResult.fulfillmentText;
        }catch(error2){
            console.log(error2);
        }
        console.log(chatbotTransportObject);
        return chatbotTransportObject;
    }
}
