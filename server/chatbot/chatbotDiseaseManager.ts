import {
  choiceContainer,
  ChoiceLevel,
  choiceServerObject,
  DialogEvents,
  Diseases,
} from './support/chatbotSupport';
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
    choiceLevel: ChoiceLevel,
    isCritical: boolean
  ): choiceContainer {
    switch (disease) {
      case Diseases.BACKPAIN:
        return this.adaptSevertiyForCriticallity(
          back_pain.getBackpainForChoiceLevel(choiceLevel),
          isCritical,
          choiceLevel
        );
      case Diseases.EAR_PROBLEMS:
        return this.adaptSevertiyForCriticallity(
          ear_problems.getSymptomForChoiceLevel(choiceLevel),
          isCritical,
          choiceLevel
        );
      case Diseases.EYE_PROBLEMS:
        return this.adaptSevertiyForCriticallity(
          eye_problems.getSymptomForChoiceLevel(choiceLevel),
          isCritical,
          choiceLevel
        );
      case Diseases.SORE_THROAT:
        return this.adaptSevertiyForCriticallity(
          sore_throat.getSymptomForChoiceLevel(choiceLevel),
          isCritical,
          choiceLevel
        );
      case Diseases.HEADACHE:
        return this.adaptSevertiyForCriticallity(
          headache.getSymptomForChoiceLevel(choiceLevel),
          isCritical,
          choiceLevel
        );
      default:
        break;
    }
  }

  private static adaptSevertiyForCriticallity(
    container: choiceContainer,
    isCritical: boolean,
    choiceLevel: ChoiceLevel
  ): choiceContainer {
    const event = this.getEventForChoiceLevel(choiceLevel, isCritical);
    return this.changeSeverityForChoiceContainer(container, event);
  }

  private static changeSeverityForChoiceContainer(
    container: choiceContainer,
    event: DialogEvents
  ): choiceContainer {
    container.choices.forEach((choice) => {
      if (!choice.isFallback) {
        choice.event = event;
      }
    });
    return container;
  }

  private static getEventForChoiceLevel(
    choiceLevel: ChoiceLevel,
    isCritical: boolean
  ): DialogEvents {
    switch (choiceLevel) {
      case ChoiceLevel.RED:
        return DialogEvents.AMBULANCE_EXIT;
      case ChoiceLevel.ORANGE:
        return isCritical
          ? DialogEvents.AMBULANCE_EXIT
          : DialogEvents.CALL_DOCTOR_ASAP;
      case ChoiceLevel.YELLOW:
        return isCritical
          ? DialogEvents.CALL_DOCTOR_ASAP
          : DialogEvents.BOOK_APPOINTMENT_ASK;
      case ChoiceLevel.BLUE:
      case ChoiceLevel.GREEN:
        return DialogEvents.BOOK_APPOINTMENT_ASK;
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
      event: DialogEvents.EVENT_ASK_WHO_IS_ILL + '#' + Diseases.BACKPAIN,
      description: 'Specified as any pain percieved in the back area.',
      isFallback: false,
    };

    const ear_problems: choiceServerObject = {
      label: 'Ear problems',
      event: DialogEvents.EVENT_ASK_WHO_IS_ILL + '#' + Diseases.EAR_PROBLEMS,
      description:
        'Specified as any pain radiating from the ear or hearing problems.',
      isFallback: false,
    };

    const eye_problems: choiceServerObject = {
      label: 'Eye problems',
      event: DialogEvents.EVENT_ASK_WHO_IS_ILL + '#' + Diseases.EYE_PROBLEMS,
      description:
        'Specified as any pain radiating from the eye or vision related problems.',
      isFallback: false,
    };

    const headache: choiceServerObject = {
      label: 'Headache',
      event: DialogEvents.EVENT_ASK_WHO_IS_ILL + '#' + Diseases.HEADACHE,
      description:
        'Specified as any pain radiating from the forhead or upper head area.',
      isFallback: false,
    };

    const throat: choiceServerObject = {
      label: 'Sore throat',
      event: DialogEvents.EVENT_ASK_WHO_IS_ILL + '#' + Diseases.SORE_THROAT,
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
