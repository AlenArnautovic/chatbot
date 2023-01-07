import * as df from 'dialogflow';
import { devKeys } from './devKeyConfig';

export class Chatbot{
    static projectId = devKeys.googleProjectId;
    static sessionId = devKeys.dialogFlowSessionID;
    static languageCode = devKeys.dialogFlowSessionLanguageCode;
    
    static credts:df.Credentials = {
        client_email: devKeys.googleClientEmail,
        private_key: devKeys.googlePrivateKey
    }
    
    static sessionClient = new df.SessionsClient({projectId:Chatbot.projectId,credentials:Chatbot.credts});
    
    public static textQuery = async(userMessage:string, userId:string)=>{
        console.log(userMessage);
        const sessionPath = Chatbot.sessionClient.sessionPath(Chatbot.projectId,Chatbot.sessionId+userId);
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
            console.log(response);
            return response;
        }catch(error){
            console.log(error);
            return null;
        }
    }
}
