import { chatbotDiseaseManager } from '../chatbotDiseaseManager';
import {
  choiceContainer,
  ChoiceLevel,
  choiceServerObject,
  DialogEvents,
} from '../support/chatbotSupport';
import {
  acute_chemical_eye_injury,
  acute_complete_loss_of_vision,
  diplopia,
  foreign_body_sensation,
  hot,
  moderate_pain,
  penetrating_eye_injury,
  possible_sepsis,
  recent_mild_pain,
  recent_problem,
  recent_reduced_visual_acuity,
  red_eye,
  servere_pain,
  very_hot,
} from '../symptoms/symptomStore';

/**
 * by Nicolai Haferkamp
 *
 * Based on: "Emergency Triage 3rd Edition (2014)" by Kevin Mackway-Jones, Janet Marsden & Jill Windle -> pages 104-105
 */
export class eye_problems {
  static eye_problems_red: choiceContainer = { choices: null };
  static eye_problems_orange: choiceContainer = { choices: null };
  static eye_problems_yellow: choiceContainer = { choices: null };
  static eye_problems_green: choiceContainer = { choices: null };

  constructor() {
    eye_problems.eye_problems_red.choices = eye_problems.initializeRed();
    eye_problems.eye_problems_orange.choices = eye_problems.initalizeOrange();
    eye_problems.eye_problems_yellow.choices = eye_problems.initializeYellow();
    eye_problems.eye_problems_green.choices = eye_problems.initializeGreen();
  }

  public static getSymptomForChoiceLevel(
    choiceLevel: ChoiceLevel
  ): choiceContainer {
    switch (choiceLevel) {
      case ChoiceLevel.RED:
        return this.eye_problems_red;
      case ChoiceLevel.ORANGE:
        return this.eye_problems_orange;
      case ChoiceLevel.YELLOW:
        return this.eye_problems_yellow;
      case ChoiceLevel.GREEN:
        return this.eye_problems_green;
    }
  }

  private static initializeRed(): choiceServerObject[] {
    const redList = [
      acute_chemical_eye_injury,
      chatbotDiseaseManager.createChoiceFallback(
        DialogEvents.EVENT_CHOICE_ORANGE
      ),
    ];
    return redList;
  }
  private static initalizeOrange(): choiceServerObject[] {
    const orangeList = [
      penetrating_eye_injury,
      acute_complete_loss_of_vision,
      servere_pain,
      very_hot,
      possible_sepsis,
      chatbotDiseaseManager.createChoiceFallback(
        DialogEvents.EVENT_CHOICE_YELLOW
      ),
    ];
    return orangeList;
  }
  private static initializeYellow(): choiceServerObject[] {
    const yellowList = [
      recent_reduced_visual_acuity,
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
      red_eye,
      foreign_body_sensation,
      diplopia,
      recent_mild_pain,
      recent_problem,
      chatbotDiseaseManager.createChoiceFallback(
        DialogEvents.BOOK_APPOINTMENT_ASK
      ),
    ];
    return greenList;
  }
}
