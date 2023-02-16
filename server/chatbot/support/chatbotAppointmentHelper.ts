import { google } from '@google-cloud/dialogflow/build/protos/protos';

export class AppointmentHelper {
  public static retrieveAppointmentFromResponse(
    response: [
      google.cloud.dialogflow.v2.IDetectIntentResponse,
      google.cloud.dialogflow.v2.IDetectIntentRequest,
      any
    ],
    userId: string
  ): void {
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
            break;
          case 'time':
            break;
          default:
            break;
        }
      }
    }
  }
}
