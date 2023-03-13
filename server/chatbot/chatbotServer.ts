import dialogflow from '@google-cloud/dialogflow';
import { google } from '@google-cloud/dialogflow/build/protos/protos';
import e from 'express';
import { v4 as uuid } from 'uuid';
import { getInformationOfAppointment } from '../database/controllers/patient';
import { chatbotDiseaseManager } from './chatbotDiseaseManager';
import { AppointmentHelper } from './support/chatbotAppointmentHelper';
import {
  activePatiens,
  getDiseaseForId,
  getIsRelatedForId,
  getPatientInfoObjectForId,
  PatientInfo,
} from './support/chatbotPatientInfoStore';
import {
  chatbotTransportObject,
  choiceContainer,
  ChoiceLevel,
  DialogEvents,
  Diseases,
} from './support/chatbotSupport';
import { devKeys } from './support/devKeyConfig';

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
    console.log(request);
    try {
      const response = await Chatbot.sessionClient.detectIntent(request);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  private static eventQueryForAppointment = async (
    eventName: string,
    userId: string,
    patientName?: string,
    appointment?: string
  ) => {
    const sessionPath = Chatbot.sessionClient.projectAgentSessionPath(
      Chatbot.projectId,
      this.getFullUserId(userId)
    );
    let request: google.cloud.dialogflow.v2.IDetectIntentRequest;
    switch (eventName) {
      case DialogEvents.EVENT_PATIENT_HAS_APPOINTMENT:
      case DialogEvents.EVENT_APPOINTMENT_IS_AVAILABLE:
        request = {
          session: sessionPath,
          queryInput: {
            event: {
              name: eventName,
              languageCode: Chatbot.languageCode,
              parameters: {
                fields: {
                  name: { stringValue: patientName },
                  time: { stringValue: appointment },
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
        for (const key of keys) {
          switch (key) {
            case 'given-name':
              if (
                fields[key].stringValue != null &&
                fields[key].stringValue.length > 0
              ) {
                this.patchPatientInfo(userId, fields[key].stringValue);
              }
              break;
            case 'last-name':
              if (
                fields[key].stringValue != null &&
                fields[key].stringValue.length > 0
              ) {
                this.patchPatientInfo(userId, null, fields[key].stringValue);
              }
              break;
            case 'patient-birthdate':
              if (
                fields[key].stringValue != null &&
                fields[key].stringValue.length > 0
              ) {
                const birthdate = AppointmentHelper.splitBirthdate(
                  fields[key].stringValue
                );
                this.patchPatientInfo(userId, null, null, birthdate);
              }
              break;
            case 'vNumber':
              if (
                fields[key].numberValue != null &&
                fields[key].numberValue > 0
              ) {
                this.patchPatientInfo(
                  userId,
                  null,
                  null,
                  null,
                  fields[key].numberValue
                );
              }
              break;
            case 'illness':
              if (
                fields[key].stringValue != null &&
                fields[key].stringValue.length > 0
              ) {
                this.patchPatientInfo(
                  userId,
                  null,
                  null,
                  null,
                  null,
                  fields[key].stringValue
                );
              }
              break;
            case 'phone-number':
              if (
                fields[key].stringValue != null &&
                fields[key].stringValue.length > 0
              ) {
                this.patchPatientInfo(
                  userId,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  fields[key].stringValue
                );
              }
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
    birthdate?: string,
    vNumber?: number,
    disease?: string,
    symptom?: string,
    isRelatedPerson?: boolean,
    phoneNumber?: string
  ) {
    const activePatientsIterator = activePatiens;
    let patientExists = false;
    for (const activePatient of activePatientsIterator) {
      if (activePatient.userId == userId) {
        patientExists = true;
        firstName != null ? (activePatient.firstName = firstName) : null;
        lastName != null ? (activePatient.lastName = lastName) : null;
        birthdate != null ? (activePatient.birthdate = birthdate) : null;
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
        birthdate: birthdate != null ? birthdate : '',
        vNumber: vNumber != null ? vNumber : -1,
        disease: disease != null ? disease : '',
        symptom: symptom != null ? symptom : '',
        isRelatedPerson: isRelatedPerson != null ? isRelatedPerson : false,
        phoneNumber: phoneNumber != null ? phoneNumber : '',
      };
      activePatiens.push(newPatient);
    }
  }

  public static async createChatbotTransportObject(
    response: [
      google.cloud.dialogflow.v2.IDetectIntentResponse,
      google.cloud.dialogflow.v2.IDetectIntentRequest,
      any
    ],
    userId: string
  ): Promise<chatbotTransportObject> {
    new chatbotDiseaseManager();
    const chatbotTransportObject: chatbotTransportObject = {
      isError: false,
      fulfillmentText: '',
      isMultipleChoice: false,
      isReminderForPatient: false,
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
        case 'appointment_date_time':
          if (response[0].queryResult.allRequiredParamsPresent) {
            AppointmentHelper.retrieveAppointmentFromResponse(
              response,
              this.getFullUserId(userId)
            );
            if (
              (await AppointmentHelper.checkIfAppointmentAvailable(
                this.getFullUserId(userId)
              )) == DialogEvents.EVENT_APPOINTMENT_IS_AVAILABLE
            ) {
              response[0].queryResult.fulfillmentText =
                await this.triggerAppointmentAgree(this.getFullUserId(userId));
              if (response[0].queryResult.fulfillmentText == null) {
                chatbotTransportObject.isError = true;
              }
            } else {
              chatbotTransportObject.fulfillmentText =
                'Im sorry about that but the Doctor is not Available at that time. How about the following time slots?';
              chatbotTransportObject.isMultipleChoice = true;
              chatbotTransportObject.choiceContainer =
                await AppointmentHelper.createMultipleChoiceForAppointments(
                  this.getFullUserId(userId)
                );
            }
          }
          break;
        case 'Event_book_appointment_Ask':
        case 'Event_Call_Ambulace_Exit':
        case 'event_book_appointment_related_ask':
        case 'Event_Call_Doctor_ASAP':
          chatbotTransportObject.isReminderForPatient = true;
          break;
        case 'patient_get_phone_number':
        case 'related_person_get_phone_number':
          response[0].queryResult.fulfillmentText =
            await this.getMessageForAppointmentRequest(
              this.getFullUserId(userId)
            );
          if (response[0].queryResult.fulfillmentText == null) {
            chatbotTransportObject.isError = true;
          }
          break;
        default:
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

  private static async triggerAppointmentAgree(
    userId: string
  ): Promise<string> {
    try {
      const patient = getPatientInfoObjectForId(userId);
      const patientFullName = patient.firstName + ' ' + patient.lastName;
      const response = await this.eventQueryForAppointment(
        DialogEvents.EVENT_APPOINTMENT_IS_AVAILABLE,
        userId,
        patientFullName,
        patient.appointment
      );

      return response[0].queryResult.fulfillmentText;
    } catch (error) {
      return null;
    }
  }

  private static async getMessageForAppointmentRequest(
    userId: string
  ): Promise<string> {
    const event = await AppointmentHelper.createDataResponse(userId);
    let response: [
      google.cloud.dialogflow.v2.IDetectIntentResponse,
      google.cloud.dialogflow.v2.IDetectIntentRequest,
      any
    ];

    try {
      if (event == DialogEvents.EVENT_PATIENT_HAS_APPOINTMENT) {
        const patient = getPatientInfoObjectForId(userId);
        const patientFullName = patient.firstName + ' ' + patient.lastName;
        const time = await AppointmentHelper.getTimeFromAppointment(userId);
        response = await this.eventQueryForAppointment(
          event,
          userId,
          patientFullName,
          time
        );
        return response[0].queryResult.fulfillmentText;
      } else {
        response = await this.eventQueryForAppointment(event, userId);
        return response[0].queryResult.fulfillmentText;
      }
    } catch (error) {
      return null;
    }
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
      console.log(activePatiens);
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
