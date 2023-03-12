import { google } from '@google-cloud/dialogflow/build/protos/protos';
import {
  addPatient,
  checkIfPatientHasAppointmentForDisease,
  checkPatientsData,
} from '../../database/controllers/patient';
import {
  getPatientInfoObjectForId,
  PatientInfo,
} from './chatbotPatientInfoStore';
import { timeObject } from './chatbotSupport';

export class AppointmentHelper {
  public static retrieveAppointmentFromResponse(
    response: [
      google.cloud.dialogflow.v2.IDetectIntentResponse,
      google.cloud.dialogflow.v2.IDetectIntentRequest,
      any
    ],
    userId: string
  ): timeObject {
    const timeObject: timeObject = {
      date: '',
      time: '',
    };
    if (
      response[0] != null &&
      response[0].queryResult.parameters != null &&
      response[0].queryResult.parameters.fields != null
    ) {
      const fields = response[0].queryResult.parameters.fields;
      const keys = Object.keys(fields);
      for (const key of keys) {
        switch (key) {
          case 'date':
            if (
              fields[key].listValue != null &&
              fields[key].listValue.values != null &&
              fields[key].listValue.values.length > 0
            ) {
              const values = fields[key].listValue.values;
              const firstDate = values[0].stringValue;
              timeObject.date = this.retrieveInfoFromJson(firstDate, true);
            }
            break;
          case 'time':
            if (
              fields[key].listValue != null &&
              fields[key].listValue.values != null &&
              fields[key].listValue.values.length > 0
            ) {
              const values = fields[key].listValue.values;
              const firstTime = values[0].stringValue;
              timeObject.time = this.retrieveInfoFromJson(firstTime, false);
            }
            break;
          default:
            break;
        }
      }
    }
    return timeObject;
  }

  private static retrieveInfoFromJson(value: string, isDate: boolean): string {
    const splitted = value.split('T');
    if (isDate) {
      const onlyDate = splitted[0];
      const splittedDate = onlyDate.split('-');
      const returnDate =
        splittedDate[2] + '.' + splittedDate[1] + '.' + splittedDate[0];
      return returnDate;
    } else {
      const onlyTime = splitted[1];
      const splittedTime = onlyTime.split(':');
      const returnTime = splittedTime[0] + ':' + splittedTime[1];
      return returnTime;
    }
  }

  public static createAppointmentMessage(
    timeObject: timeObject,
    userId
  ): string {
    const patientInfo = getPatientInfoObjectForId(userId);
    if (patientInfo != null) {
      try {
        const answerString = `Thanks! I booked you an Appointment for ${patientInfo.disease} on the ${timeObject.date} at ${timeObject.time}. See you then!`;
        return answerString;
      } catch (error) {
        return null;
      }
    } else {
      return null;
    }
  }

  public static async checkIfUserIsInDataBase(
    userId: string
  ): Promise<boolean> {
    const patient: PatientInfo = getPatientInfoObjectForId(userId);
    const result: any = await checkPatientsData(
      patient.birthdate,
      patient.firstName,
      patient.lastName,
      patient.vNumber.toString()
    );

    if (
      result != null &&
      result.length > 0 &&
      result[0].Correct_PATIENT_Data == 'Yes'
    ) {
      console.log('true');
      return true;
    } else {
      console.log('false');
      return false;
    }
  }

  public static convertDatabaseIntoJSON(result: any): any[] {
    try {
      if (result != null) {
        const data = JSON.parse(JSON.stringify(result));
        console.log(data);
        return data;
      } else {
        console.log('Database Object could not be converted!');
        return null;
      }
    } catch (error) {
      console.log('Database Object  could not be converted!');
      return null;
    }
  }

  public static async saveUserInDatabase(userId: string): Promise<boolean> {
    const patient: PatientInfo = getPatientInfoObjectForId(userId);

    const vnumber = patient.vNumber;
    const firstName = patient.firstName;
    const lastName = patient.lastName;
    const phone = patient.phoneNumber;
    const birthdate = patient.birthdate;

    const result = await addPatient(
      vnumber.toString(),
      firstName,
      lastName,
      phone.toString(),
      birthdate,
      '1'
    );
    return result != null ? true : false;
  }

  public static splitBirthdate(dateTime: string): string {
    if (dateTime != null && dateTime.length > 0) {
      try {
        const splitted = dateTime.split('T');
        return splitted[0];
      } catch (error) {
        return '';
      }
    } else {
      return '';
    }
  }

  public static async isPatientForDiseaseAlreadyRegistered(
    userId: string
  ): Promise<boolean> {
    const patient: PatientInfo = getPatientInfoObjectForId(userId);
    const result = await checkIfPatientHasAppointmentForDisease(
      patient.vNumber.toString(),
      patient.disease
    );

    if (result != null) {
      return result[0] != null ? true : false;
    } else {
      return false;
    }
  }

  // public static async createDataResponse(userId:string):Promise<string>{
  //   const toProof = await AppointmentHelper.checkIfUserIsInDataBase(userId);
  //   if(toProof){
  //     const toProofDisease = await AppointmentHelper.isPatientForDiseaseAlreadyRegistered(userId);
  //     if()
  //   }else{

  //   }
  // }
}
