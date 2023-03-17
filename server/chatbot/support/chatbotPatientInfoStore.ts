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
  phoneNumber: string;
  symptom?: string;
  appointment?: string;
  criticalCondition?: boolean;
  lengthOfDisease?: duration;
  //TODO extend
}

export interface duration {
  amount: number;
  unit: string;
}
export function getPatientInfoObjectForId(userId: string): PatientInfo {
  for (const patient of activePatiens) {
    if (patient.userId == userId) {
      return patient;
    }
  }
}

export function setCriticalCondition(
  userId: string,
  conditionIsCritical: boolean
) {
  const patient = getPatientInfoObjectForId(userId);
  if (patient != null) {
    patient.criticalCondition = conditionIsCritical;
  }
}

export function deletePatientData(userId: string) {
  try {
    const patient = getPatientInfoObjectForId(userId);

    const index = activePatiens.indexOf(patient, 0);
    if (index > -1) {
      activePatiens.splice(index, 1);
    }
  } catch (error) {
    console.log(error);
  }
}

export function getFullNameById(userId: string): string {
  const patient = getPatientInfoObjectForId(userId);
  return patient.firstName + ' ' + patient.lastName;
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

export function getEnumForDiseaseName(disease: string): Diseases {
  switch (disease) {
    case 'Back Pain':
      return Diseases.BACKPAIN;
    case 'Ear Problem':
      return Diseases.EAR_PROBLEMS;
    case 'Eye Problem':
      return Diseases.EYE_PROBLEMS;
    case 'Sore Throat':
      return Diseases.SORE_THROAT;
    case 'Headache':
      return Diseases.HEADACHE;
    default:
      return null;
  }
}
