import { choiceContainer, choiceServerObject } from "./chatbotSupport";

//DISCLAIMER: all content inside the variables is either indirectly or directly cited by the article "Emergency Triage 3rd Edition (2014)" by Kevin Mackway-Jones, Janet Marsden & Jill Windle
export class chatbotDiseaseStore {

    static backpain_red: choiceContainer = {choices:null};
    static backpain_orange: choiceContainer = {choices:null};
    static backpain_yellow: choiceContainer = {choices:null};
    static backpain_green: choiceContainer = {choices:null};

    constructor(){
        chatbotDiseaseStore.backpain_red.choices = chatbotDiseaseStore.initializeBackPainRed();
        chatbotDiseaseStore.backpain_orange.choices = chatbotDiseaseStore.initializeBackPainOrange();
        chatbotDiseaseStore.backpain_yellow.choices = chatbotDiseaseStore.initializeBackPainYellow();
        chatbotDiseaseStore.backpain_green.choices = chatbotDiseaseStore.initializeBackPainGreen();
    }

    private static initializeBackPainRed(): choiceServerObject[]{
        const choice1:choiceServerObject ={
            label: "Airway compromise",
            event: "ambulance_exit",
            description: `An airway may be compromised either because it cannot be kept open or
            because the airway protective reflexes (that stop inhalation) have been
            lost. Failure to keep the airway open will result either in intermittent
            total obstruction or in partial obstruction. This will manifest itself as
            snoring or bubbling sounds during breathing`,
            isFallback: false
        }
        const choice2:choiceServerObject ={
            label: "Inadequate breathing",
            event: "ambulance_exit",
            description: `Absence
            of breathing is defined as no respiration or respiratory effort as assessed by
            looking, listening and feeling for 10 seconds`,
            isFallback: false
        }
        const choice3:choiceServerObject ={
            label: "Shock",
            event: "ambulance_exit",
            description: `The classic signs
            include sweating, pallor, tachycardia, hypotension and reduced conscious
            level.`,
            isFallback: false
        }
        const fallback = this.createChoiceFallback();
        fallback.event = 'backpain_red';
        return [choice1,choice2,choice3,fallback];
    }
    
    private static initializeBackPainOrange():choiceServerObject[]{
        const choice1: choiceServerObject ={
            label: "Neurological deficit <24hours",
            event: "ambulance_exit",
            description: `Any loss of neurological function that has come on within the
            previous 24 hours. This might include altered or lost sensation,
            weakness of the limbs (either transiently or permanently) and
            alterations in bladder or bowel function`,
            isFallback: false
        }
        const choice2: choiceServerObject ={
            label: "Major injuries",
            event: "ambulance_exit",
            description: `Penetrating injuries (stab or gunshot) and injuries with high energy
            transfer`,
            isFallback: false
        }
        const choice3: choiceServerObject ={
            label: "Fever",
            event: "ambulance_exit",
            description: `A temperature of more than 41 degrees Celsius`,
            isFallback: false
        }
        const choice5: choiceServerObject = {
            label: "Sepsis",
            event: "ambulance_exit",
            description: `An altered mental state,
            low blood pressure or raised respiratory
            rate`,
            isFallback: false
        }
        const choice6: choiceServerObject = {
            label: "Aortic pain",
            event: "ambulance_exit",
            description: `The onset of symptoms is sudden and the leading symptom is
            severe abdominal or chest pain. The pain may be described
            as sharp, stabbing or ripping in character. Classically aortic
            chest pain is felt around the sternum and then radiates to
            the shoulder blades, aortic abdominal pain is felt in the
            centre of the abdomen and radiates to the back. The pain
            may get better or even vanish and then recur elsewhere.
            Over time, pain may also be felt in the arms, neck, lower
            jaw, stomach or hips`,
            isFallback: false
        }

        const choice4: choiceServerObject = {
            label: "Abdominal pain",
            event: "ambulance_exit",
            description: `Any pain felt in the abdomen. Abdominal pain associated with
            back pain may indicate abdominal aortic aneurysm, while
            association with PV bleeding may indicate ectopic pregnancy or
            miscarriage`,
            isFallback: false
        }

        const choice7: choiceServerObject = {
            label: "Severe pain",
            event: "ambulance_exit",
            description: `Pain that disables you to do normal activities.`,
            isFallback: false
        }
        const fallback = this.createChoiceFallback();
        fallback.event = 'backpain_orange';
        return [choice1,choice2,choice3,choice4,choice5,choice6,choice7,fallback];
    }
    private static initializeBackPainYellow():choiceServerObject[]{
        const choice1: choiceServerObject ={
            label: "Neurological deficit >24hours",
            event: "call_doctor_asap",
            description: `Any loss of neurological function including altered or lost
            sensation, weakness of the limbs (either transiently or
            permanently) and alterations in bladder or bowel function.`,
            isFallback: false
        }
        const choice3: choiceServerObject = {
            label: "Back trauma",
            event: "call_doctor_asap",
            description: `This may be top to bottom (loading), for instance when people fall
            and land on their feet, bending (forwards, backwards or to the
            side) or twisting.`,
            isFallback: false
        }
        const choice4: choiceServerObject = {
            label: "Unable to walk",
            event: "call_doctor_asap",
            description: `It is important to try and distinguish between someone who has
            pain and difficulty walking and those who cannot walk. Only the
            latter can be said to be unable to walk.`,
            isFallback: false
        }
        const choice5: choiceServerObject = {
            label: "Fever",
            event: "call_doctor_asap",
            description: `A temperature of more than 38 degrees Celsius.`,
            isFallback: false
        }
        const choice6: choiceServerObject = {
            label: "Colicky pain",
            event: "call_doctor_asap",
            description: `Pain that comes and goes in waves. Renal colic tends to come and
            go over 20 minutes or so.`,
            isFallback: false
        }
        const choice7: choiceServerObject = {
            label: "Moderate Pain",
            event: "call_doctor_asap",
            description: `Servere Difficulties. May stop you to do some things.`,
            isFallback: false
        }
        const fallback = this.createChoiceFallback();
        fallback.event = 'backpain_yellow';
        return [choice1,choice3,choice4,choice5,choice6,choice7,fallback];
    }
    private static initializeBackPainGreen():choiceServerObject[]{
        const choice1: choiceServerObject ={
            label: "Recent mild pain",
            event: "book_appointment_ask",
            description: `Mild stinging. Can do any normal acitivy, with only a few problems.`,
            isFallback: false
        }
        const choice2: choiceServerObject = {
            label: "Recent problem",
            event: "book_appointment_ask",
            description: `Any other problem that was not mentioned in the previous assensment.`,
            isFallback: false
        }
        const fallback = this.createChoiceFallback();
        fallback.event = 'book_appointment_ask';
        return [choice1,choice2,fallback];
    }

    private static createChoiceFallback(): choiceServerObject{
        const choiceFallback:choiceServerObject ={
            label: "None of the mentioned",
            event: "",
            description: "Are you sure you have none of the mentioned? Please consider reading the descriptions of every symptom by clicking on it before continuing.",
            isFallback: true
        }
        return choiceFallback;
    }

}



