import { choiceContainer, choiceServerObject } from "./chatbotSupport";

export class chatbotDiseaseStore {

    static backpain_red: choiceContainer = {choices:null};
    constructor(){


        chatbotDiseaseStore.backpain_red.choices = chatbotDiseaseStore.initializeChoices();
    }

    private static initializeChoices(): choiceServerObject[]{
        const choice1:choiceServerObject ={
            label: "Airway compromise",
            event: "",
            description: `An airway may be compromised either because it cannot be kept open or
            because the airway protective reflexes (that stop inhalation) have been
            lost. Failure to keep the airway open will result either in intermittent
            total obstruction or in partial obstruction. This will manifest itself as
            snoring or bubbling sounds during breathing`,
            isFallback: false
        }
        const choice2:choiceServerObject ={
            label: "Inadequate breathing",
            event: "",
            description: `Absence
            of breathing is defined as no respiration or respiratory effort as assessed by
            looking, listening and feeling for 10 seconds`,
            isFallback: false
        }
        const choice3:choiceServerObject ={
            label: "Shock",
            event: "",
            description: `The classic signs
            include sweating, pallor, tachycardia, hypotension and reduced conscious
            level.`,
            isFallback: false
        }
        const choiceFallback:choiceServerObject ={
            label: "None of the mentioned",
            event: "",
            description: "Are you sure you have none of the mentioned? Please consider reading the descriptions of every symptom by clicking on it before continuing.",
            isFallback: true
        }
        return [choice1,choice2,choice3,choiceFallback];
    }
    

}



