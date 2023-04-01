import { chatbotDiseaseManager } from '../chatbotDiseaseManager';
import {
  choiceContainer,
  ChoiceLevel,
  choiceServerObject,
  DialogEvents,
} from '../support/chatbotSupport';
import {
  abdominal_pain,
  airway_compromise,
  aortic_pain,
  colicky_pain,
  direct_traume_to_the_back,
  hot,
  inadequate_breathing,
  moderate_pain,
  new_neurological_deficit_less_than_24_hours_old,
  new_neurological_deficit_more_than_24_hours_old,
  possible_sepsis,
  recent_mild_pain,
  recent_problem,
  segnificant_mechanism_of_injury,
  servere_pain,
  shock,
  unable_to_walk,
  very_hot,
} from '../symptoms/symptomStore';

/**
 * by Nicolai Haferkamp
 *
 * Based on: "Emergency Triage 3rd Edition (2014)" by Kevin Mackway-Jones, Janet Marsden & Jill Windle -> pages 80-81
 */
export class back_pain {
  static backpain_red: choiceContainer = { choices: null };
  static backpain_orange: choiceContainer = { choices: null };
  static backpain_yellow: choiceContainer = { choices: null };
  static backpain_green: choiceContainer = { choices: null };

  constructor() {
    back_pain.backpain_red.choices = back_pain.initializeBackPainRed();
    back_pain.backpain_orange.choices = back_pain.initializeBackPainOrange();
    back_pain.backpain_yellow.choices = back_pain.initializeBackPainYellow();
    back_pain.backpain_green.choices = back_pain.initializeBackPainGreen();
  }

  public static getBackpainForChoiceLevel(
    choiceLevel: ChoiceLevel
  ): choiceContainer {
    switch (choiceLevel) {
      case ChoiceLevel.RED:
        return this.backpain_red;
      case ChoiceLevel.ORANGE:
        return this.backpain_orange;
      case ChoiceLevel.YELLOW:
        return this.backpain_yellow;
      case ChoiceLevel.GREEN:
        return this.backpain_green;
    }
  }

  private static initializeBackPainRed(): choiceServerObject[] {
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

  private static initializeBackPainOrange(): choiceServerObject[] {
    const orangeList = [
      new_neurological_deficit_less_than_24_hours_old,
      segnificant_mechanism_of_injury,
      very_hot,
      possible_sepsis,
      //aortic_pain,
      //abdominal_pain,
      servere_pain,
      chatbotDiseaseManager.createChoiceFallback(
        DialogEvents.EVENT_CHOICE_YELLOW
      ),
    ];
    return orangeList;
  }
  private static initializeBackPainYellow(): choiceServerObject[] {
    const orangeList = [
      new_neurological_deficit_more_than_24_hours_old,
      direct_traume_to_the_back,
      unable_to_walk,
      hot,
      //colicky_pain,
      moderate_pain,
      chatbotDiseaseManager.createChoiceFallback(
        DialogEvents.EVENT_CHOICE_GREEN
      ),
    ];

    return orangeList;
  }
  private static initializeBackPainGreen(): choiceServerObject[] {
    const greenList = [
      recent_mild_pain,
      recent_problem,
      chatbotDiseaseManager.createChoiceFallback(
        DialogEvents.BOOK_APPOINTMENT_ASK
      ),
    ];

    return greenList;
  }
}
