import { Diseases } from './chatbotSupport';

export const activePatiens: PatientInfo[] = [];

export interface PatientInfo {
  userId: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  vNumber: number;
  disease: string;
  isRelatedPerson: boolean;
  phoneNumber: number;
  symptom?: string;

  //TODO extend
}
export function getPatientInfoObjectForId(userId: string): PatientInfo {
  for (const patient of activePatiens) {
    if (patient.userId == userId) {
      return patient;
    }
  }
}

export function getDiseaseForId(userId: string): Diseases {
  for (const patient of activePatiens) {
    if (patient.userId == userId) {
      return getEnumForDiseaseName(patient.disease);
    }
  }
}

export function getIsRelatedForId(userId: string): boolean {
  for (const patient of activePatiens) {
    if (patient.userId == userId) {
      return patient.isRelatedPerson;
    }
  }
  return false;
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
