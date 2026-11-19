// ========================================
// Flag Quiz V2
// Power-up System
// ========================================


const powerupSystem = {

    meter: 0,

    required: 10,

    doubleScoreQuestions: 0

};




// Called after every correct answer

function increasePowerupMeter(){

    if(getAvailablePowerups().length === 0) return;

    powerupSystem.meter++;


    updatePowerupUI();



    if(
        powerupSystem.meter >=
        powerupSystem.required
    ){

        powerupSystem.meter = 0;


        giveRandomPowerup();


    }

}





function giveRandomPowerup(){

    const rewards = getAvailablePowerups();

    if(rewards.length === 0) return;



    for(
        let i = 0;
        i < 3;
        i++
    ){

        const reward =

            rewards[
                Math.floor(
                    Math.random() *
                    rewards.length
                )
            ];



        game.powerups[reward]++;

    }



    updatePowerupUI();

}




function useFiftyFifty(){

    if(isPowerupDisabled("fiftyFifty")) return;

    if(game.powerups.fiftyFifty <= 0){

        return;

    }



    game.powerups.fiftyFifty--;



    const buttons =
        document.querySelectorAll(
            ".answer"
        );



    let removed = 0;



    buttons.forEach(button=>{


        if(
            button.dataset.correct === "false"
            &&
            removed < 2
        ){

            button.dataset.fiftyHidden = "true";

            button.style.visibility = "hidden";

            removed++;

        }


    });



    updatePowerupUI();

}





function useSkip(){

    if(isPowerupDisabled("skip")) return;

    if(game.powerups.skip <= 0){

        return;

    }



    game.powerups.skip--;



    nextQuestion();



    updatePowerupUI();

}





function useDoubleScore(){

    if(isPowerupDisabled("doubleScore")) return;

    if(game.powerups.doubleScore <= 0){

        return;

    }



    game.powerups.doubleScore--;


    powerupSystem.doubleScoreQuestions = 5;


    updatePowerupUI();

}





function applyScoreMultiplier(){


    if(
        powerupSystem.doubleScoreQuestions
        > 0
    ){

        powerupSystem.doubleScoreQuestions--;

        return 2;

    }



    return 1;

}





function updatePowerupUI(){


    const fifty =
        document.getElementById(
            "fiftyCount"
        );


    const skip =
        document.getElementById(
            "skipCount"
        );


    const double =
        document.getElementById(
            "doubleCount"
        );


    const meter =
        document.getElementById(
            "powerMeter"
        );

    const powerupsEl =
        document.querySelector(
            ".powerups"
        );

    const availablePowerups = getAvailablePowerups();

    if(powerupsEl){

        powerupsEl.style.display =
            availablePowerups.length === 0
                ? "none"
                : "";

    }

    [
        ["fiftyPowerup", "fiftyFifty"],
        ["skipPowerup", "skip"],
        ["doublePowerup", "doubleScore"]
    ].forEach(([elementId, powerup]) => {
        const element = document.getElementById(elementId);
        if(element) element.hidden = isPowerupDisabled(powerup);
    });



    if(fifty)
        fifty.textContent =
            game.powerups.fiftyFifty;



    if(skip)
        skip.textContent =
            game.powerups.skip;



    if(double)
        double.textContent =
            game.powerups.doubleScore;



    if(meter)
        meter.value =
            powerupSystem.meter;


}

function getAvailablePowerups(){
    return ["fiftyFifty", "skip", "doubleScore"].filter(
        powerup => !isPowerupDisabled(powerup)
    );
}





function getCorrectAnswerText(){

    const question =
        game.currentQuestion;


    return question.answers[
        question.correct
    ];

}
