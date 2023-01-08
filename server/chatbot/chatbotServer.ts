import dialogflow from '@google-cloud/dialogflow';
import {v4 as uuid} from 'uuid';
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
            console.log(response[0].queryResult.fulfillmentText);
            return response;
        }catch(error){
            console.log(error);
            return null;
        }
    }
}
