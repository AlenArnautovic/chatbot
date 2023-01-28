import dialogflow from '@google-cloud/dialogflow';
import { google } from '@google-cloud/dialogflow/build/protos/protos';
import e from 'express';
import {v4 as uuid} from 'uuid';
import { chatbotDiseaseStore } from './chatbotDiseaseStore';
import { activePatiens, PatientInfo } from './chatbotPatientInfoStore';
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
        const fullUserId = Chatbot.sessionId+userId;
        const sessionPath = Chatbot.sessionClient.projectAgentSessionPath(Chatbot.projectId,fullUserId);
        const request:google.cloud.dialogflow.v2.IDetectIntentRequest = {
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
            this.retiveInformationFromPatient(response,fullUserId);
            return response;
        }catch(error){
            console.log(error);
            return null;
        }
    }

    public static eventQuery = async(eventName:string, userId:string)=>{
        const sessionPath = Chatbot.sessionClient.projectAgentSessionPath(Chatbot.projectId,Chatbot.sessionId+userId);
        const request:google.cloud.dialogflow.v2.IDetectIntentRequest = {
            session: sessionPath,
            queryInput: {
                event:{
                    name: eventName,
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

    private static retiveInformationFromPatient(response:[google.cloud.dialogflow.v2.IDetectIntentResponse, google.cloud.dialogflow.v2.IDetectIntentRequest,any], userId:string):void{
        try{
            if(response[0] != null && response[0].queryResult.parameters != null && response[0].queryResult.parameters.fields != null){
               const fields =  response[0].queryResult.parameters.fields;
               const keys = Object.keys(fields);
               console.log(keys);
               for(const key of keys){
                switch (key){
                    case 'given-name':
                        this.patchPatientInfo(userId,fields[key].stringValue);
                        break;
                    case 'last-name':
                        this.patchPatientInfo(userId,null,fields[key].stringValue);
                        break;
                    case 'patient_age':
                        this.patchPatientInfo(userId,null,fields[key].stringValue);
                        break;
                    case 'vNumber':
                        this.patchPatientInfo(userId,null,fields[key].stringValue);
                        break;
                    case 'illness':
                        this.patchPatientInfo(userId,null,fields[key].stringValue);
                        break;
                    default: 
                        // 
                        break;
                }

               }
        }
        }catch(error){
            console.log(error);
        }
    }

    private static patchPatientInfo(userId:string, firstName?:string, lastName?:string, age?:number, vNumber?:number, disease?:string){
           const activePatientsIterator = activePatiens;
           let patientExists = false;
           for(const activePatient of activePatientsIterator){
            if(activePatient.userId == userId){
                patientExists = true;
                firstName != null ? activePatient.firstName = firstName : null;
                lastName != null ? activePatient.lastName = lastName : null;
                age != null ? activePatient.age = age : null;
                vNumber != null ? activePatient.vNumber : null;
                if(disease != null){
                    activePatient.disease.push(disease);
                }
                break;
            }
           }
           if(!patientExists){
            const newPatient: PatientInfo  = {
                userId: userId,
                firstName: firstName != null ? firstName : '',
                lastName: lastName != null ? lastName: '',
                age: age != null ? age:  -1,
                vNumber: vNumber != null ? vNumber : -1,
                disease: disease != null ? [disease] : []
            }
            activePatiens.push(newPatient);
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
            case 'Get_Versichertennummer':
                chatbotTransportObject.isMultipleChoice = true;
                chatbotTransportObject.choiceContainer = chatbotDiseaseStore.backpain_red;
                break;
            case 'Event_Backpain_Red':
                chatbotTransportObject.isMultipleChoice = true;
                chatbotTransportObject.choiceContainer = chatbotDiseaseStore.backpain_orange;
                break;
            case 'Event_Backpain_Orange':
                chatbotTransportObject.isMultipleChoice = true;
                chatbotTransportObject.choiceContainer = chatbotDiseaseStore.backpain_yellow;
                break;
            case 'Event_Backpain_Yellow':
                chatbotTransportObject.isMultipleChoice = true;
                chatbotTransportObject.choiceContainer = chatbotDiseaseStore.backpain_green;
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
