import { Diseases } from './chatbotSupport';

export const activePatiens: PatientInfo[] = [];

export interface PatientInfo {
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  vNumber: number;
  disease: string;
  symptom?: string;
  //TODO extend
}

export function getDiseaseForId(userId: string): Diseases {
  for (const patient of activePatiens) {
    if (patient.userId == userId) {
      return getEnumForDiseaseName(patient.disease);
    }
  }
}

function getEnumForDiseaseName(disease: string): Diseases {
  switch (disease) {
    case 'backpain':
      return Diseases.BACKPAIN;
    default:
      return null;
  }
}
