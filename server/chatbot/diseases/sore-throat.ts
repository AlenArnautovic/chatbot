import { chatbotDiseaseManager } from '../chatbotDiseaseManager';
import {
  choiceContainer,
  ChoiceLevel,
  choiceServerObject,
  DialogEvents,
} from '../chatbotSupport';
import {
  airway_compromise,
  altered_concious_level,
  drooling,
  history_of_recent_foreign_travel,
  hot,
  inadequate_breathing,
  known_or_likely_immunosuppression,
  moderate_pain,
  possible_sepsis,
  rapid_onset,
  recent_mild_pain,
  recent_problem,
  servere_pain,
  special_risk_of_infection,
  stridor,
  very_hot,
  warm,
} from '../symptoms/symptomStore';

//Emergency Triage (2013) pages 150-151
export class sore_throat {
  static sore_throat_red: choiceContainer = { choices: null };
  static sore_throat_orange: choiceContainer = { choices: null };
  static sore_throat_yellow: choiceContainer = { choices: null };
  static sore_throat_green: choiceContainer = { choices: null };

  constructor() {
    sore_throat.sore_throat_red.choices = sore_throat.initializeRed();
    sore_throat.sore_throat_orange.choices = sore_throat.initalizeOrange();
    sore_throat.sore_throat_yellow.choices = sore_throat.initializeYellow();
    sore_throat.sore_throat_green.choices = sore_throat.initializeGreen();
  }

  public static getSymptomForChoiceLevel(
    choiceLevel: ChoiceLevel
  ): choiceContainer {
    switch (choiceLevel) {
      case ChoiceLevel.RED:
        return this.sore_throat_red;
      case ChoiceLevel.ORANGE:
        return this.sore_throat_orange;
      case ChoiceLevel.YELLOW:
        return this.sore_throat_yellow;
      case ChoiceLevel.GREEN:
        return this.sore_throat_green;
    }
  }

  private static initializeRed(): choiceServerObject[] {
    const redList = [
      stridor,
      drooling,
      airway_compromise,
      inadequate_breathing,
      chatbotDiseaseManager.createChoiceFallback(
        DialogEvents.EVENT_CHOICE_ORANGE
      ),
    ];
    return redList;
  }
  private static initalizeOrange(): choiceServerObject[] {
    const orangeList = [
      altered_concious_level,
      known_or_likely_immunosuppression,
      special_risk_of_infection,
      very_hot,
      possible_sepsis,
      servere_pain,
      chatbotDiseaseManager.createChoiceFallback(
        DialogEvents.EVENT_CHOICE_YELLOW
      ),
    ];
    return orangeList;
  }
  private static initializeYellow(): choiceServerObject[] {
    const yellowList = [
      rapid_onset,
      history_of_recent_foreign_travel,
      hot,
      moderate_pain,
      chatbotDiseaseManager.createChoiceFallback(
        DialogEvents.EVENT_CHOICE_GREEN
      ),
    ];
    return yellowList;
  }
  private static initializeGreen(): choiceServerObject[] {
    const greenList = [
      warm,
      recent_mild_pain,
      recent_problem,
      chatbotDiseaseManager.createChoiceFallback(
        DialogEvents.BOOK_APPOINTMENT_ASK
      ),
    ];
    return greenList;
  }
}
