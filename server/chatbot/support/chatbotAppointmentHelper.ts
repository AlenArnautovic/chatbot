import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { getPatientInfoObjectForId } from './chatbotPatientInfoStore';
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
}
