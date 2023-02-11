import {
  choiceContainer,
  ChoiceLevel,
  choiceServerObject,
  DialogEvents,
  Diseases,
} from './chatbotSupport';
import { back_pain } from './diseases/back-pain';
import { ear_problems } from './diseases/ear-problems';
import { eye_problems } from './diseases/eye-problem';
import { headache } from './diseases/headache';
import { sore_throat } from './diseases/sore-throat';

//DISCLAIMER: all content inside the variables is either indirectly or directly cited by the article "Emergency Triage 3rd Edition (2014)" by Kevin Mackway-Jones, Janet Marsden & Jill Windle
export class chatbotDiseaseManager {
  static available_diseases: choiceContainer = { choices: null };

  constructor() {
    new back_pain();
    new ear_problems();
    new eye_problems();
    new sore_throat();
    new headache();
    chatbotDiseaseManager.available_diseases.choices =
      chatbotDiseaseManager.createAvailableDiseases();
  }

  public static getInfoForDisease(
    disease: Diseases,
    choiceLevel: ChoiceLevel
  ): choiceContainer {
    switch (disease) {
      case Diseases.BACKPAIN:
        return back_pain.getBackpainForChoiceLevel(choiceLevel);
      case Diseases.EAR_PROBLEMS:
        return ear_problems.getSymptomForChoiceLevel(choiceLevel);
      case Diseases.EYE_PROBLEMS:
        return eye_problems.getSymptomForChoiceLevel(choiceLevel);
      case Diseases.SORE_THROAT:
        return sore_throat.getSymptomForChoiceLevel(choiceLevel);
      case Diseases.HEADACHE:
        return headache.getSymptomForChoiceLevel(choiceLevel);
      default:
        break;
    }
  }

  public static createChoiceFallback(event: string): choiceServerObject {
    const choiceFallback: choiceServerObject = {
      label: 'None of the mentioned',
      event: event,
      description:
        'Are you sure you have none of the mentioned? Please consider reading the descriptions of every symptom by clicking on it before continuing.',
      isFallback: true,
    };
    return choiceFallback;
  }

  private static createAvailableDiseases(): choiceServerObject[] {
    const back_pain: choiceServerObject = {
      label: 'Back pain',
      event: DialogEvents.EVENT_SELECTED_ILLNESS + '#' + Diseases.BACKPAIN,
      description: 'Specified as any pain percieved in the back area.',
      isFallback: false,
    };

    const ear_problems: choiceServerObject = {
      label: 'Ear problems',
      event: DialogEvents.EVENT_SELECTED_ILLNESS + '#' + Diseases.EAR_PROBLEMS,
      description:
        'Specified as any pain radiating from the ear or hearing problems.',
      isFallback: false,
    };

    const eye_problems: choiceServerObject = {
      label: 'Eye problems',
      event: DialogEvents.EVENT_SELECTED_ILLNESS + '#' + Diseases.EYE_PROBLEMS,
      description:
        'Specified as any pain radiating from the eye or vision related problems.',
      isFallback: false,
    };

    const headache: choiceServerObject = {
      label: 'Headache',
      event: DialogEvents.EVENT_SELECTED_ILLNESS + '#' + Diseases.HEADACHE,
      description:
        'Specified as any pain radiating from the forhead or upper head area.',
      isFallback: false,
    };

    const throat: choiceServerObject = {
      label: 'Sore throat',
      event: DialogEvents.EVENT_SELECTED_ILLNESS + '#' + Diseases.SORE_THROAT,
      description:
        'Specified as any pain radiating from the throat or swallowing problems.',
      isFallback: false,
    };

    return [
      back_pain,
      ear_problems,
      eye_problems,
      headache,
      throat,
      this.createChoiceFallback(DialogEvents.EVENT_SELECTED_ILLNESS_NOT_THERE),
    ];
  }
}
