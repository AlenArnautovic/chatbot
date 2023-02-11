import { Diseases } from './chatbotSupport';

export const activePatiens: PatientInfo[] = [];

export interface PatientInfo {
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  vNumber: number;
  disease: string;
  isRelatedPerson: boolean;
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
    case 'ear-problems':
      return Diseases.EAR_PROBLEMS;
    case 'eye-problems':
      return Diseases.EYE_PROBLEMS;
    case 'sore-throat':
      return Diseases.SORE_THROAT;
    case 'headache':
      return Diseases.HEADACHE;
    default:
      return null;
  }
}
