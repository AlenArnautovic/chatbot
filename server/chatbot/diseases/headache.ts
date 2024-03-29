import { chatbotDiseaseManager } from '../chatbotDiseaseManager';
import {
  choiceContainer,
  ChoiceLevel,
  choiceServerObject,
  DialogEvents,
} from '../support/chatbotSupport';
import {
  abrupt_onset,
  acute_complete_loss_of_vision,
  airway_compromise,
  altered_concious_level,
  currently_fitting,
  history_of_unconsciousness,
  hot,
  inadequate_breathing,
  moderate_pain,
  new_neurological_deficit_less_than_24_hours_old,
  new_neurological_deficit_more_than_24_hours_old,
  persistent_vomiting,
  possible_sepsis,
  recent_mild_pain,
  recent_problem,
  recent_reduced_visual_acuity,
  servere_pain,
  shock,
  signs_of_meningism,
  very_hot,
  vomiting,
  warm,
} from '../symptoms/symptomStore';

/**
 * By Nicolai Haferkamp
 *
 * Based on: "Emergency Triage 3rd Edition (2014)" by Kevin Mackway-Jones, Janet Marsden & Jill Windle -> Pages 116-117
 */
export class headache {
  static headache_red: choiceContainer = { choices: null };
  static headache_orange: choiceContainer = { choices: null };
  static headache_yellow: choiceContainer = { choices: null };
  static headache_green: choiceContainer = { choices: null };

  constructor() {
    headache.headache_red.choices = headache.initializeRed();
    headache.headache_orange.choices = headache.initalizeOrange();
    headache.headache_yellow.choices = headache.initializeYellow();
    headache.headache_green.choices = headache.initializeGreen();
  }

  public static getSymptomForChoiceLevel(
    choiceLevel: ChoiceLevel
  ): choiceContainer {
    switch (choiceLevel) {
      case ChoiceLevel.RED:
        return this.headache_red;
      case ChoiceLevel.ORANGE:
        return this.headache_orange;
      case ChoiceLevel.YELLOW:
        return this.headache_yellow;
      case ChoiceLevel.GREEN:
        return this.headache_green;
    }
  }

  private static initializeRed(): choiceServerObject[] {
    const redList = [
      airway_compromise,
      inadequate_breathing,
      shock,
      currently_fitting,
      chatbotDiseaseManager.createChoiceFallback(
        DialogEvents.EVENT_CHOICE_ORANGE
      ),
    ];
    return redList;
  }
  private static initalizeOrange(): choiceServerObject[] {
    const orangeList = [
      //altered_concious_level,
      new_neurological_deficit_less_than_24_hours_old,
      signs_of_meningism,
      //purpura,
      //non_blanching_rash,
      abrupt_onset,
      //acute_complete_loss_of_vision,
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
      new_neurological_deficit_more_than_24_hours_old,
      recent_reduced_visual_acuity,
      //temporal_scalp_tenderness,
      history_of_unconsciousness,
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
      vomiting,
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
