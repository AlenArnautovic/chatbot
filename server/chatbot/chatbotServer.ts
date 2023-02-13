import dialogflow from '@google-cloud/dialogflow';
import { google } from '@google-cloud/dialogflow/build/protos/protos';
import e from 'express';
import { v4 as uuid } from 'uuid';
import { chatbotDiseaseManager } from './chatbotDiseaseManager';
import {
  activePatiens,
  getDiseaseForId,
  getIsRelatedForId,
  PatientInfo,
} from './chatbotPatientInfoStore';
import {
  chatbotTransportObject,
  choiceContainer,
  ChoiceLevel,
  DialogEvents,
  Diseases,
} from './chatbotSupport';
import { devKeys } from './devKeyConfig';

export class Chatbot {
  static eventSplitter = '#';
  static projectId = devKeys.googleProjectId;
  static languageCode = devKeys.dialogFlowSessionLanguageCode;

  static sessionId = uuid();

  static credts = {
    client_email: devKeys.googleClientEmail,
    private_key: devKeys.googlePrivateKey,
  };

  static sessionClient = new dialogflow.SessionsClient({
    projectId: Chatbot.projectId,
    credentials: Chatbot.credts,
  });

  public static textQuery = async (userMessage: string, userId: string) => {
    const fullUserId = this.getFullUserId(userId);
    const sessionPath = Chatbot.sessionClient.projectAgentSessionPath(
      Chatbot.projectId,
      fullUserId
    );
    const request: google.cloud.dialogflow.v2.IDetectIntentRequest = {
      session: sessionPath,
      queryInput: {
        text: {
          text: userMessage,
          languageCode: Chatbot.languageCode,
        },
      },
    };

    try {
      const response = await Chatbot.sessionClient.detectIntent(request);
      this.retiveInformationFromPatient(response, fullUserId);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  public static eventQuery = async (eventName: string, userId: string) => {
    const sessionPath = Chatbot.sessionClient.projectAgentSessionPath(
      Chatbot.projectId,
      this.getFullUserId(userId)
    );

    if (eventName.includes(this.eventSplitter)) {
      try {
        const splittedEvent = eventName.split(this.eventSplitter);
        eventName = splittedEvent[0];
        this.patchPatientInfo(
          this.getFullUserId(userId),
          null,
          null,
          null,
          null,
          splittedEvent[1]
        );
      } catch (errorEvent) {
        console.log(errorEvent);
      }
    }
    const request = this.buildEventRequest(
      eventName,
      this.getFullUserId(userId),
      sessionPath
    );
    try {
      const response = await Chatbot.sessionClient.detectIntent(request);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  private static buildEventRequest(
    eventName: string,
    userId: string,
    sessionPath: string
  ): google.cloud.dialogflow.v2.IDetectIntentRequest {
    let request: google.cloud.dialogflow.v2.IDetectIntentRequest;
    switch (eventName) {
      case DialogEvents.BOOK_APPOINTMENT_ASK:
        if (getIsRelatedForId(userId)) {
          eventName = DialogEvents.EVENT_BOOK_APPOINTMENT_RELATED_ASK;
        }
        request = {
          session: sessionPath,
          queryInput: {
            event: {
              name: eventName,
              languageCode: Chatbot.languageCode,
            },
          },
        };
        break;
      case DialogEvents.EVENT_ASK_WHO_IS_ILL:
        request = {
          session: sessionPath,
          queryInput: {
            event: {
              name: eventName,
              languageCode: Chatbot.languageCode,
              parameters: {
                fields: {
                  illness: { stringValue: getDiseaseForId(userId) },
                },
              },
            },
          },
        };
        break;
      case DialogEvents.CALL_DOCTOR_ASAP:
        request = {
          session: sessionPath,
          queryInput: {
            event: {
              name: eventName,
              languageCode: Chatbot.languageCode,
              parameters: {
                fields: {
                  //TODO get phone number of doctors office
                  number: { numberValue: 12345678 },
                },
              },
            },
          },
        };
        break;
      default:
        request = {
          session: sessionPath,
          queryInput: {
            event: {
              name: eventName,
              languageCode: Chatbot.languageCode,
            },
          },
        };
        break;
    }
    return request;
  }

  private static getFullUserId(userId: string) {
    return Chatbot.sessionId + userId;
  }

  private static retiveInformationFromPatient(
    response: [
      google.cloud.dialogflow.v2.IDetectIntentResponse,
      google.cloud.dialogflow.v2.IDetectIntentRequest,
      any
    ],
    userId: string
  ): void {
    try {
      if (
        response[0] != null &&
        response[0].queryResult.parameters != null &&
        response[0].queryResult.parameters.fields != null
      ) {
        const fields = response[0].queryResult.parameters.fields;
        const keys = Object.keys(fields);
        console.log(keys);
        for (const key of keys) {
          switch (key) {
            case 'given-name':
              this.patchPatientInfo(userId, fields[key].stringValue);
              break;
            case 'last-name':
              this.patchPatientInfo(userId, null, fields[key].stringValue);
              break;
            case 'patient_age':
              this.patchPatientInfo(
                userId,
                null,
                null,
                fields[key].numberValue
              );
              break;
            case 'vNumber':
              this.patchPatientInfo(
                userId,
                null,
                null,
                null,
                fields[key].numberValue
              );
              break;
            case 'illness':
              this.patchPatientInfo(
                userId,
                null,
                null,
                null,
                null,
                fields[key].stringValue
              );
              break;
            case 'phone-number':
              this.patchPatientInfo(
                userId,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                fields[key].numberValue
              );
              break;
            default:
              //
              break;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  private static patchPatientInfo(
    userId: string,
    firstName?: string,
    lastName?: string,
    age?: number,
    vNumber?: number,
    disease?: string,
    symptom?: string,
    isRelatedPerson?: boolean,
    phoneNumber?: number
  ) {
    const activePatientsIterator = activePatiens;
    let patientExists = false;
    for (const activePatient of activePatientsIterator) {
      if (activePatient.userId == userId) {
        patientExists = true;
        firstName != null ? (activePatient.firstName = firstName) : null;
        lastName != null ? (activePatient.lastName = lastName) : null;
        age != null ? (activePatient.age = age) : null;
        vNumber != null ? (activePatient.vNumber = vNumber) : null;
        disease != null ? (activePatient.disease = disease) : null;
        symptom != null ? (activePatient.symptom = symptom) : null;
        isRelatedPerson != null
          ? (activePatient.isRelatedPerson = isRelatedPerson)
          : null;
        phoneNumber != null ? (activePatient.phoneNumber = phoneNumber) : null;
        break;
      }
    }
    if (!patientExists) {
      const newPatient: PatientInfo = {
        userId: userId,
        firstName: firstName != null ? firstName : '',
        lastName: lastName != null ? lastName : '',
        age: age != null ? age : -1,
        vNumber: vNumber != null ? vNumber : -1,
        disease: disease != null ? disease : '',
        symptom: symptom != null ? symptom : '',
        isRelatedPerson: isRelatedPerson != null ? isRelatedPerson : false,
        phoneNumber: phoneNumber != null ? phoneNumber : null,
      };
      activePatiens.push(newPatient);
    }
  }

  public static createChatbotTransportObject(
    response: [
      google.cloud.dialogflow.v2.IDetectIntentResponse,
      google.cloud.dialogflow.v2.IDetectIntentRequest,
      any
    ],
    userId: string
  ): chatbotTransportObject {
    new chatbotDiseaseManager();
    const chatbotTransportObject: chatbotTransportObject = {
      isError: false,
      fulfillmentText: '',
      isMultipleChoice: false,
    };
    try {
      const intentName = response[0].queryResult.intent.displayName;
      switch (intentName) {
        case 'Illness_Start':
        case 'ask_who_is_ill_person':
          this.setIsRelatedPerson(this.getFullUserId(userId), false);
          if (response[0].queryResult.allRequiredParamsPresent) {
            this.createTransportObjectForDiseaseLevel(
              userId,
              chatbotTransportObject,
              ChoiceLevel.RED
            );
          }
          break;
        case 'related_person_is_ill':
        case 'user_is_well_approve':
        case 'ask_who_is_ill_related':
          this.setIsRelatedPerson(this.getFullUserId(userId), true);
          if (response[0].queryResult.allRequiredParamsPresent) {
            this.createTransportObjectForDiseaseLevel(
              userId,
              chatbotTransportObject,
              ChoiceLevel.RED
            );
          }
          break;
        case 'event_choice_orange':
          this.createTransportObjectForDiseaseLevel(
            userId,
            chatbotTransportObject,
            ChoiceLevel.ORANGE
          );
          break;
        case 'event_choice_yellow':
          this.createTransportObjectForDiseaseLevel(
            userId,
            chatbotTransportObject,
            ChoiceLevel.YELLOW
          );
          break;
        case 'event_choice_green':
          this.createTransportObjectForDiseaseLevel(
            userId,
            chatbotTransportObject,
            ChoiceLevel.GREEN
          );
          break;
        case 'illness_disease_not_covered':
          chatbotTransportObject.isMultipleChoice = true;
          chatbotTransportObject.choiceContainer =
            chatbotDiseaseManager.available_diseases;
          break;
        case '':
          break;
        default:
          //chatbotTransportObject.isError = true;
          break;
      }
    } catch (error) {
      chatbotTransportObject.isError = true;
      console.log(error);
    }
    try {
      if (
        response[0].queryResult.fulfillmentText != null &&
        response[0].queryResult.fulfillmentText.length > 0
      ) {
        chatbotTransportObject.fulfillmentText =
          response[0].queryResult.fulfillmentText;
      }
    } catch (error2) {
      chatbotTransportObject.isError = true;
      console.log(error2);
    }
    console.log(chatbotTransportObject);
    return chatbotTransportObject;
  }

  private static createTransportObjectForDiseaseLevel(
    userId: string,
    chatbotTransportObject: chatbotTransportObject,
    choiceLevel: ChoiceLevel
  ) {
    const disease = getDiseaseForId(this.getFullUserId(userId));
    if (disease != null) {
      chatbotTransportObject.isMultipleChoice = true;
      chatbotTransportObject.choiceContainer =
        chatbotDiseaseManager.getInfoForDisease(disease, choiceLevel);
    } else {
      this.createErrorForNotfoundDisease(chatbotTransportObject);
    }
  }

  private static createErrorForNotfoundDisease(
    chatbotTransportObject: chatbotTransportObject
  ) {
    chatbotTransportObject.isError = true;
    chatbotTransportObject.errorMessage =
      'Disease was not found. Please reload the Website.';
  }

  private static setIsRelatedPerson(userId: string, isRelated: boolean) {
    this.patchPatientInfo(
      userId,
      null,
      null,
      null,
      null,
      null,
      null,
      isRelated
    );
  }
}
