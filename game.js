// ========================================
// Flag Quiz V2
// Game Engine
// ========================================


function setupGame(){

    game.score = 0;
    game.streak = 0;

    game.lives = game.maxLives;

    game.questionsSeen = 0;
    game.correctAnswers = 0;
    game.wrongAnswers = 0;

    game.totalAnswerTime = 0;

    game.scoreMultiplier = 1;


}



function nextQuestion(){

    if(game.lives <= 0){

        endGame();

        return;

    }


    game.currentQuestion =
        getNextQuestion();


    game.questionsSeen++;


    game.currentQuestionStart =
        Date.now();


    displayQuestion(
        game.currentQuestion
    );


}




function displayQuestion(question){


    const questionText =
        document.getElementById("question");


    const image =
        document.getElementById("flagImage");



    questionText.textContent =
        question.question;


    image.src =
        question.image;



    let answers =
        question.answers.map(
            (answer,index)=>{

                return {

                    text:answer,

                    correct:
                        index === question.correct

                };

            }
        );



    shuffleArray(answers);



    const buttons =
        document.querySelectorAll(".answer");



    buttons.forEach(
        (button,index)=>{


            button.disabled=false;

            button.className="answer";


            button.textContent =
                answers[index].text;



            button.onclick=()=>{

                answerQuestion(
                    answers[index].correct,
                    button
                );

            };


        }
    );

}





function answerQuestion(correct,button){


    const answerTime =
        (Date.now()-game.currentQuestionStart)/1000;


    game.totalAnswerTime += answerTime;



    document
        .querySelectorAll(".answer")
        .forEach(btn=>{

            btn.disabled=true;

        });



    if(correct){


        correctAnswer(button);


    }
    else{


        wrongAnswer(button);


    }



    updateUI();
    updateStatsUI();



    setTimeout(()=>{

        nextQuestion();

    },1000);


}




function correctAnswer(button){


    button.classList.add("correct");



    game.score +=
    game.scoreMultiplier *
    applyScoreMultiplier();



    game.streak++;


    game.correctAnswers++;



    if(game.streak > game.bestStreak){

        game.bestStreak =
            game.streak;


        localStorage.setItem(
            "bestStreak",
            game.bestStreak
        );

    }



    updateMultiplier();



}




function wrongAnswer(button){


    button.classList.add("wrong");



    game.lives--;


    game.streak=0;


    game.wrongAnswers++;


}





function updateMultiplier(){


    game.scoreMultiplier =
        1 +
        Math.floor(
            game.questionsSeen / 50
        );


}




function endGame(){


    if(game.score > game.bestScore){


        game.bestScore =
            game.score;


        localStorage.setItem(
            "bestScore",
            game.bestScore
        );


    }



    showGameOver();

}
