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


    const rewards = [

        "fiftyFifty",

        "skip",

        "doubleScore"

    ];



    const reward =

        rewards[
            Math.floor(
                Math.random() *
                rewards.length
            )
        ];



    game.powerups[reward]++;



    alert(
        "🎁 You received: "
        +
        formatPowerupName(reward)
    );



    updatePowerupUI();

}




function formatPowerupName(powerup){


    const names = {


        fiftyFifty:
            "50/50",


        skip:
            "Skip",


        doubleScore:
            "Double Score"


    };


    return names[powerup];

}





function useFiftyFifty(){


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
            button.textContent !==
            getCorrectAnswerText()
            &&
            removed < 2
        ){

            button.style.visibility =
                "hidden";


            removed++;

        }


    });



    updatePowerupUI();

}





function useSkip(){


    if(game.powerups.skip <= 0){

        return;

    }



    game.powerups.skip--;



    nextQuestion();



    updatePowerupUI();

}





function useDoubleScore(){


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





function getCorrectAnswerText(){

    const question =
        game.currentQuestion;


    return question.answers[
        question.correct
    ];

}
