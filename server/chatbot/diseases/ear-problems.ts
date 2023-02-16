import { chatbotDiseaseManager } from '../chatbotDiseaseManager';
import {
  choiceContainer,
  ChoiceLevel,
  choiceServerObject,
  DialogEvents,
} from '../support/chatbotSupport';
import {
  airway_compromise,
  altered_concious_level,
  auricular_haematoma,
  history_of_head_injury,
  hot,
  inadequate_breathing,
  moderate_pain,
  persistent_vomiting,
  possible_sepsis,
  recent_hearing_loss,
  recent_mild_pain,
  recent_problem,
  servere_pain,
  shock,
  uncontrollable_major_heamorrhage,
  uncontrollable_minor_heamorrhage,
  vertigo,
  very_hot,
  warm,
} from '../symptoms/symptomStore';

//Emergency Triage (2013) pages 102-103
export class ear_problems {
  static ear_problems_red: choiceContainer = { choices: null };
  static ear_problems_orange: choiceContainer = { choices: null };
  static ear_problems_yellow: choiceContainer = { choices: null };
  static ear_problems_green: choiceContainer = { choices: null };

  constructor() {
    ear_problems.ear_problems_red.choices = ear_problems.initializeRed();
    ear_problems.ear_problems_orange.choices = ear_problems.initalizeOrange();
    ear_problems.ear_problems_yellow.choices = ear_problems.initializeYellow();
    ear_problems.ear_problems_green.choices = ear_problems.initializeGreen();
  }

  public static getSymptomForChoiceLevel(
    choiceLevel: ChoiceLevel
  ): choiceContainer {
    switch (choiceLevel) {
      case ChoiceLevel.RED:
        return this.ear_problems_red;
      case ChoiceLevel.ORANGE:
        return this.ear_problems_orange;
      case ChoiceLevel.YELLOW:
        return this.ear_problems_yellow;
      case ChoiceLevel.GREEN:
        return this.ear_problems_green;
    }
  }

  private static initializeRed(): choiceServerObject[] {
    const redList = [
      airway_compromise,
      inadequate_breathing,
      shock,
      chatbotDiseaseManager.createChoiceFallback(
        DialogEvents.EVENT_CHOICE_ORANGE
      ),
    ];
    return redList;
  }
  private static initalizeOrange(): choiceServerObject[] {
    const orangeList = [
      altered_concious_level,
      uncontrollable_major_heamorrhage,
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
      uncontrollable_minor_heamorrhage,
      history_of_head_injury,
      persistent_vomiting,
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
      auricular_haematoma,
      vertigo,
      recent_hearing_loss,
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
