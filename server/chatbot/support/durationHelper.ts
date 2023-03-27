import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { duration as duration } from './chatbotPatientInfoStore';

/**
 * by Nicolai Haferkamp
 */
export class DurationHelper {
  public static retrieveDurationString(
    value: google.protobuf.IStruct
  ): duration {
    const fields = value.fields;
    const keys = Object.keys(fields);
    const length: duration = {
      amount: -1,
      unit: '',
    };
    for (const key of keys) {
      switch (key) {
        case 'amount':
          if (fields[key].numberValue != null) {
            length.amount = fields[key].numberValue;
          }
          break;
        case 'unit':
          if (
            fields[key].stringValue != null &&
            fields[key].stringValue.length > 0
          ) {
            length.unit = fields[key].stringValue;
          }
          break;
        default:
          //
          break;
      }
    }

    if (length.amount < 0 || length.unit.length <= 0) {
      return null;
    } else {
      return length;
    }
  }
}
