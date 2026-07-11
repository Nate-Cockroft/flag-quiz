// ========================================
// Flag Quiz V2
// Statistics System
// ========================================


function getAccuracy(){


    if(game.questionsSeen === 0){

        return 0;

    }



    return Math.round(

        (
            game.correctAnswers /
            game.questionsSeen
        ) * 100

    );

}




function getAverageTime(){


    if(game.questionsSeen === 0){

        return 0;

    }



    return (

        game.totalAnswerTime /
        game.questionsSeen

    ).toFixed(2);


}




function updateStatsUI(){


    const accuracy =
        document.getElementById(
            "accuracy"
        );


    const averageTime =
        document.getElementById(
            "averageTime"
        );


    const questions =
        document.getElementById(
            "questionsSeen"
        );



    if(accuracy){

        accuracy.textContent =
            getAccuracy()+"%";

    }



    if(averageTime){

        averageTime.textContent =
            getAverageTime()+"s";

    }



    if(questions){

        questions.textContent =
            game.questionsSeen;

    }


}
