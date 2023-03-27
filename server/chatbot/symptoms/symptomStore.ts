import { choiceServerObject, DialogEvents } from '../support/chatbotSupport';

/**
 * by Nicolai Haferkamp
 *
 * DISCLAIMER: all content inside the variables is either indirectly or directly cited by the Book "Emergency Triage 3rd Edition (2014)" by Kevin Mackway-Jones, Janet Marsden & Jill Windle
 */
export const airway_compromise: choiceServerObject = {
  label: 'Airway compromise',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `An airway may be compromised either because it cannot be kept open or
          because the airway protective reflexes (that stop inhalation) have been
          lost. Failure to keep the airway open will result either in intermittent
          total obstruction or in partial obstruction. This will manifest itself as
          snoring or bubbling sounds during breathing`,
  isFallback: false,
};

export const inadequate_breathing: choiceServerObject = {
  label: 'Inadequate breathing',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `Absence
          of breathing is defined as no respiration or respiratory effort as assessed by
          looking, listening and feeling for 10 seconds`,
  isFallback: false,
};

export const shock: choiceServerObject = {
  label: 'Shock',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `The classic signs
          include sweating, pallor, tachycardia, hypotension and reduced conscious
          level.`,
  isFallback: false,
};

export const new_neurological_deficit_less_than_24_hours_old: choiceServerObject =
  {
    label: 'Acute Neurological deficit',
    event: DialogEvents.AMBULANCE_EXIT,
    description: `Any loss of neurological function that has come on within the
          previous 24 hours. This might include altered or lost sensation,
          weakness of the limbs (either transiently or permanently) and
          alterations in bladder or bowel function`,
    isFallback: false,
  };
export const segnificant_mechanism_of_injury: choiceServerObject = {
  label: 'Major injuries',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `Penetrating injuries (stab or gunshot) and injuries with high energy
          transfer`,
  isFallback: false,
};
export const very_hot: choiceServerObject = {
  label: 'Fever',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `A temperature of more than 41 degrees Celsius`,
  isFallback: false,
};
export const possible_sepsis: choiceServerObject = {
  label: 'Sepsis',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `An altered mental state,
          low blood pressure or raised respiratory
          rate`,
  isFallback: false,
};
export const aortic_pain: choiceServerObject = {
  label: 'Aortic pain',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `The onset of symptoms is sudden and the leading symptom is
          severe abdominal or chest pain. The pain may be described
          as sharp, stabbing or ripping in character. Classically aortic
          chest pain is felt around the sternum and then radiates to
          the shoulder blades, aortic abdominal pain is felt in the
          centre of the abdomen and radiates to the back. The pain
          may get better or even vanish and then recur elsewhere.
          Over time, pain may also be felt in the arms, neck, lower
          jaw, stomach or hips`,
  isFallback: false,
};

export const abdominal_pain: choiceServerObject = {
  label: 'Abdominal pain',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `Any pain felt in the abdomen. Abdominal pain associated with
          back pain may indicate abdominal aortic aneurysm, while
          association with PV bleeding may indicate ectopic pregnancy or
          miscarriage`,
  isFallback: false,
};

export const servere_pain: choiceServerObject = {
  label: 'Severe pain',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `Pain that disables the patient to do normal activities.`,
  isFallback: false,
};

export const new_neurological_deficit_more_than_24_hours_old: choiceServerObject =
  {
    label: 'Neurological deficit',
    event: DialogEvents.CALL_DOCTOR_ASAP,
    description: `Any loss of neurological function including altered or lost
          sensation, weakness of the limbs (either transiently or
          permanently) and alterations in bladder or bowel function.`,
    isFallback: false,
  };
export const direct_traume_to_the_back: choiceServerObject = {
  label: 'Back trauma',
  event: DialogEvents.CALL_DOCTOR_ASAP,
  description: `This may be top to bottom (loading), for instance when people fall
          and land on their feet, bending (forwards, backwards or to the
          side) or twisting.`,
  isFallback: false,
};
export const unable_to_walk: choiceServerObject = {
  label: 'Unable to walk',
  event: DialogEvents.CALL_DOCTOR_ASAP,
  description: `It is important to try and distinguish between someone who has
          pain and difficulty walking and those who cannot walk. Only the
          latter can be said to be unable to walk.`,
  isFallback: false,
};
export const hot: choiceServerObject = {
  label: 'Fever',
  event: DialogEvents.CALL_DOCTOR_ASAP,
  description: `A temperature of more than 38 degrees Celsius.`,
  isFallback: false,
};
export const colicky_pain: choiceServerObject = {
  label: 'Colicky pain',
  event: DialogEvents.CALL_DOCTOR_ASAP,
  description: `Pain that comes and goes in waves. Renal colic tends to come and
          go over 20 minutes or so.`,
  isFallback: false,
};
export const moderate_pain: choiceServerObject = {
  label: 'Moderate Pain',
  event: DialogEvents.CALL_DOCTOR_ASAP,
  description: `Servere Difficulties. May stop you to do some things.`,
  isFallback: false,
};
export const recent_mild_pain: choiceServerObject = {
  label: 'Recent mild pain',
  event: DialogEvents.BOOK_APPOINTMENT_ASK,
  description: `Mild stinging. Can do any normal acitivy, with only a few problems.`,
  isFallback: false,
};
export const recent_problem: choiceServerObject = {
  label: 'Recent problem',
  event: DialogEvents.BOOK_APPOINTMENT_ASK,
  description: `Any other problem that was not mentioned in the previous assensment.`,
  isFallback: false,
};

export const altered_concious_level: choiceServerObject = {
  label: 'Altered conciousness',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `The patient will respond to voice altered or only to pain or doesn't respond to anything.`,
  isFallback: false,
};

export const uncontrollable_major_heamorrhage: choiceServerObject = {
  label: 'Major heamorrhage',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `Described as blood from the area of problem in focus that is unconrollably flowing heavily or soak through large dressings
  quickly.`,
  isFallback: false,
};

export const uncontrollable_minor_heamorrhage: choiceServerObject = {
  label: 'Minor heamorrhage',
  event: DialogEvents.CALL_DOCTOR_ASAP,
  description: `Described as blood from the area of problem in focus that is continues to flow slightly or ooze.`,
  isFallback: false,
};

export const history_of_head_injury: choiceServerObject = {
  label: 'Head injury',
  event: DialogEvents.CALL_DOCTOR_ASAP,
  description: `A history of a recent physically traumatic event involving the head.
    Usually this will be reported by the patient but if the patient has
    been unconscious this history should be sought from a reliable
    witness.`,
  isFallback: false,
};

export const persistent_vomiting: choiceServerObject = {
  label: 'Vomiting',
  event: DialogEvents.CALL_DOCTOR_ASAP,
  description: `Vomiting that is continuous or that occurs without any respite
    between episodes.`,
  isFallback: false,
};

export const auricular_haematoma: choiceServerObject = {
  label: 'Heamatoma',
  event: DialogEvents.BOOK_APPOINTMENT_ASK,
  description: `A tense haematoma (usually post traumatic) in the outer ear.`,
  isFallback: false,
};

export const vertigo: choiceServerObject = {
  label: 'Vertigo',
  event: DialogEvents.BOOK_APPOINTMENT_ASK,
  description: `An acute feeling of spinning or dizziness, possibly accompanied by
    nausea and vomiting.`,
  isFallback: false,
};

export const recent_hearing_loss: choiceServerObject = {
  label: 'Hearing loss',
  event: DialogEvents.BOOK_APPOINTMENT_ASK,
  description: `Loss of hearing in one or both ears within the previous week.`,
  isFallback: false,
};

export const warm: choiceServerObject = {
  label: 'Warm',
  event: DialogEvents.BOOK_APPOINTMENT_ASK,
  description: `Body Temperature of less than 38.5 degrees Celsius.`,
  isFallback: false,
};

export const acute_chemical_eye_injury: choiceServerObject = {
  label: 'Chemical injury',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `Any substance splashed into or placed into the eye within the past
    12 hours that caused stinging, burning or reduced vision should
    be assumed to have caused chemical injury.`,
  isFallback: false,
};

export const penetrating_eye_injury: choiceServerObject = {
  label: 'Penetrating injury',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `A recent physically traumatic event involving penetration of the
    globe.`,
  isFallback: false,
};

export const acute_complete_loss_of_vision: choiceServerObject = {
  label: 'Complete loss of vision',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `Loss of vision in one or both eyes within the preceding 24 hours
    that has not returned to normal.`,
  isFallback: false,
};

export const recent_reduced_visual_acuity: choiceServerObject = {
  label: 'Reduced visual acuity',
  event: DialogEvents.CALL_DOCTOR_ASAP,
  description: `Any reduction in corrected visual acuity within the past 7 days.`,
  isFallback: false,
};

export const red_eye: choiceServerObject = {
  label: 'Red eye',
  event: DialogEvents.BOOK_APPOINTMENT_ASK,
  description: `Any redness to the eye. A red eye may be painful or painless and
    may be complete or partial.`,
  isFallback: false,
};

export const foreign_body_sensation: choiceServerObject = {
  label: 'Eye sensation',
  event: DialogEvents.BOOK_APPOINTMENT_ASK,
  description: `A sensation of something in the eye, often expressed as scraping
    or grittiness.`,
  isFallback: false,
};

export const diplopia: choiceServerObject = {
  label: 'Diplopia',
  event: DialogEvents.BOOK_APPOINTMENT_ASK,
  description: `Double vision that resolves when one eye is closed.`,
  isFallback: false,
};

export const stridor: choiceServerObject = {
  label: 'Stridor',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `This may be an inspiratory or expiratory noise, or both. Stridor is
    heard best on breathing with the mouth open.`,
  isFallback: false,
};

export const drooling: choiceServerObject = {
  label: 'Drooling',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `Saliva running from the mouth as a result of being unable to swallow.`,
  isFallback: false,
};

export const known_or_likely_immunosuppression: choiceServerObject = {
  label: 'Immunsuppression',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `Any patient who is known or likely to be immunosuppressed
    including those on immunosuppressive drugs (including long-term
    steroids).`,
  isFallback: false,
};

export const special_risk_of_infection: choiceServerObject = {
  label: 'Extended infection risk',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `Known exposure to a dangerous pathogen, or travel to an area with
    an identified, current, serious infectious risk.`,
  isFallback: false,
};

export const history_of_recent_foreign_travel: choiceServerObject = {
  label: 'Foreign travel',
  event: DialogEvents.CALL_DOCTOR_ASAP,
  description: `Recent significant foreign travel (within 2 weeks).`,
  isFallback: false,
};

export const rapid_onset: choiceServerObject = {
  label: 'Rapid onset',
  event: DialogEvents.CALL_DOCTOR_ASAP,
  description: `Onset within the preceding 12 hours.`,
  isFallback: false,
};

export const vomiting: choiceServerObject = {
  label: 'Vomiting',
  event: DialogEvents.BOOK_APPOINTMENT_ASK,
  description: `Onset within the preceding 12 hours.`,
  isFallback: false,
};

export const history_of_unconsciousness: choiceServerObject = {
  label: 'Unconciousness',
  event: DialogEvents.CALL_DOCTOR_ASAP,
  description: `There may be a reliable witness who can state whether the patient
    was unconscious (and for how long). If not, a patient who is
    unable to remember the incident should be assumed to have been
    unconscious.`,
  isFallback: false,
};

export const temporal_scalp_tenderness: choiceServerObject = {
  label: 'Scalp tenderness',
  event: DialogEvents.CALL_DOCTOR_ASAP,
  description: `Tenderness on palpation over the temporal area (especially over the
        artery).`,
  isFallback: false,
};

export const currently_fitting: choiceServerObject = {
  label: 'currently fitting',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `The patients are
    currently fitting or who have fitted.`,
  isFallback: false,
};

export const signs_of_meningism: choiceServerObject = {
  label: 'Meningism',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `Classically a stiff neck together with headache and photophobia.`,
  isFallback: false,
};

export const purpura: choiceServerObject = {
  label: 'Purpura',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `A rash on any part of the body that is caused by small haemorrhages
    under the skin. A purpuric rash does not blanch (go white) when
    pressure is applied to it.`,
  isFallback: false,
};

export const non_blanching_rash: choiceServerObject = {
  label: 'Non-blanching rash',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `A rash that does not blanch (go white) when pressure is applied to it.
    Often tested using a glass tumbler to apply pressure as any colour
    change can be observed through the bottom of the tumbler.`,
  isFallback: false,
};

export const abrupt_onset: choiceServerObject = {
  label: 'Abrupt onset',
  event: DialogEvents.AMBULANCE_EXIT,
  description: `Onset within seconds or minutes. May cause waking from sleep.`,
  isFallback: false,
};
