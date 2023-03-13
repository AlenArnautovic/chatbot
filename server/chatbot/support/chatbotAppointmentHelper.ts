import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { Database } from '../../database/controllers/databaseMain';
import {
  getPatientInfoObjectForId,
  PatientInfo,
} from './chatbotPatientInfoStore';
import {
  chatbotTransportObject,
  choiceContainer,
  choiceServerObject,
  DialogEvents,
  timeObject,
} from './chatbotSupport';

export class AppointmentHelper {
  public static retrieveAppointmentFromResponse(
    response: [
      google.cloud.dialogflow.v2.IDetectIntentResponse,
      google.cloud.dialogflow.v2.IDetectIntentRequest,
      any
    ],
    userId: string
  ) {
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
    const patient = getPatientInfoObjectForId(userId);
    patient.appointment = timeObject.date + ' ' + timeObject.time;
  }

  private static retrieveInfoFromJson(value: string, isDate: boolean): string {
    const splitted = value.split('T');
    if (isDate) {
      return splitted[0];
    } else {
      const onlyTime = splitted[1];
      const splittedTime = onlyTime.split('+');
      return splittedTime[0];
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
    const result: any = await Database.checkPatientsData(
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

    const result = await Database.addPatient(
      vnumber.toString(),
      firstName,
      lastName,
      phone,
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
    const result = await Database.checkIfPatientHasAppointmentForDisease(
      patient.vNumber.toString(),
      patient.disease
    );

    if (result != null) {
      return result[0] != null ? true : false;
    } else {
      return false;
    }
  }

  public static async getTimeFromAppointment(userId: string): Promise<string> {
    const patient: PatientInfo = getPatientInfoObjectForId(userId);
    const result = await Database.checkIfPatientHasAppointmentForDisease(
      patient.vNumber.toString(),
      patient.disease
    );
    return this.convertDataBaseIntoViewFormat(result[0].time_from.toString());
  }

  public static convertDataBaseIntoViewFormat(dateTime: string): string {
    try {
      const time = dateTime;
      const splitted = time.split('T');
      const date = splitted[0];
      const hours = splitted[1];
      const splittedhours = hours.split('.');
      return date + ' from ' + splittedhours;
    } catch (error) {
      return 'Sometime';
    }
  }

  public static async createDataResponse(
    userId: string
  ): Promise<DialogEvents> {
    const toProof = await AppointmentHelper.checkIfUserIsInDataBase(userId);

    if (toProof) {
      const toProofDisease =
        await AppointmentHelper.isPatientForDiseaseAlreadyRegistered(userId);
      if (toProofDisease) {
        return DialogEvents.EVENT_PATIENT_HAS_APPOINTMENT;
      } else {
        return DialogEvents.EVENT_ASK_FOR_APPOINTMENT;
      }
    } else {
      this.saveUserInDatabase(userId);
      return DialogEvents.EVENT_ASK_FOR_APPOINTMENT;
    }
  }

  public static async checkIfAppointmentAvailable(
    userId: string
  ): Promise<DialogEvents> {
    const patient = getPatientInfoObjectForId(userId);
    const result: any = await Database.checkIfAppointmentForDiseaseIsAvailable(
      patient.disease,
      patient.appointment
    );
    if (
      result != null &&
      result.length > 0 &&
      result[0].TerminIsAvaiable == 'True'
    ) {
      return DialogEvents.EVENT_APPOINTMENT_IS_AVAILABLE;
    } else {
      console.log('false');
      return DialogEvents.EVENT_APPOINTMENT_NOT_AVAILABLE;
    }
  }

  public static async createMultipleChoiceForAppointments(
    userId: string
  ): Promise<choiceContainer> {
    const patient = getPatientInfoObjectForId(userId);
    console.log(patient);
    const result: any =
      await Database.checkIfDoctorForDiseaseIsAvailableForASpecificAppointment(
        patient.disease,
        patient.appointment
      );
    const choiceFallback: choiceServerObject = {
      label: 'none of the above',
      event: DialogEvents.EVENT_APPOINTMENT_IS_AVAILABLE_DECLINE,
      description:
        'If you have no time on the given appointments select this. There are possibly other appointments available later on that could be fitting. To trigger these, it is however necessary to reload the website!',
      isFallback: true,
    };
    const choiceObjects: choiceServerObject[] = [];

    result.forEach((element) => {
      const dateTime = element.Time_From.toISOString()
        .slice(0, 19)
        .replace('T', ' ');
      console.log();
      const choice: choiceServerObject = {
        label: dateTime,
        event: DialogEvents.EVENT_APPOINTMENT_IS_AVAILABLE + '#' + dateTime,
        description:
          'The Appointment takes up a time slot of about 15min with the Doctor. Click consent to select.',
        isFallback: false,
      };
      choiceObjects.push(choice);
    });
    choiceObjects.push(choiceFallback);
    const container: choiceContainer = {
      choices: choiceObjects,
    };

    return container;
  }

  public static async bookAppointment(userId: string) {
    const patient = getPatientInfoObjectForId(userId);
    await Database.bookAppointment(
      patient.vNumber.toString(),
      patient.appointment,
      patient.disease,
      patient.symptom != null ? patient.symptom : ''
    );
  }
}
