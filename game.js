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

    game.currentPlayer = 0;

    game.players.forEach(player => {
        player.score = 0;
        player.streak = 0;
        player.bestStreak = 0;
    });

    if(game.mode === MODES.casual){

        game.lives = game.maxLives;
        game.maxLives = Infinity;

    }

    if(
        game.mode === MODES.reverse ||
        game.mode === MODES.twoPlayer
    ){

        game.answerImageMap =
            buildAnswerImageMap(game.questions);

    }

}



function nextQuestion(){

    if(
        game.mode !== MODES.casual &&
        game.lives <= 0
    ){

        endGame();

        return;

    }

    if(
        game.maxQuestions !== null &&
        game.questionsSeen >= game.maxQuestions
    ){

        endGame();

        return;

    }

    game.currentQuestion =
        getNextQuestion();

    game.questionsSeen++;

    game.currentQuestionStart =
        Date.now();

    if(
        game.mode === MODES.hard &&
        game.currentQuestion
    ){

        const hard =
            buildHardAnswers(game.currentQuestion);

        game.currentQuestion.answers =
            hard.answers;

        game.currentQuestion.correct =
            hard.correct;

    }

    if(
        game.mode === MODES.reverse &&
        game.currentQuestion
    ){

        game.currentQuestion =
            buildReverseQuestion(game.currentQuestion);

    }

    displayQuestion(
        game.currentQuestion
    );

    updateModeUI();

}




function displayQuestion(question){

    if(!question) return;

    const questionText =
        document.getElementById("question");

    const image =
        document.getElementById("flagImage");

    questionText.textContent =
        question.question;

    if(game.mode === MODES.reverse){

        image.style.display =
            "none";

    }
    else{

        image.style.display = "";

        image.src =
            question.image;

    }

    const isReverse =
        game.mode === MODES.reverse;

    let answers =
        question.answers.map(
            (answer,index)=>{

                return {

                    text:answer,

                    image:
                        isReverse
                            ? answer
                            : null,

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

            button.className =
                button.classList.contains(
                    "answerExtra"
                )
                    ? "answer answerExtra"
                    : "answer";

            button.dataset.correct =
                index < answers.length &&
                answers[index].correct
                    ? "true"
                    : "false";

            if(index < answers.length){

                button.style.visibility =
                    "visible";

                if(isReverse){

                    button.innerHTML = "";

                    const img =
                        document.createElement("img");

                    img.src = answers[index].text;

                    img.className = "answerFlag";

                    img.alt = "Flag";

                    img.addEventListener(
                        "click",
                        (event)=>{

                            event.stopPropagation();

                            openZoom(img);

                        }
                    );

                    button.appendChild(img);

                }
                else{

                    button.textContent =
                        answers[index].text;

                }

                button.onclick=()=>{

                    answerQuestion(
                        answers[index].correct,
                        button
                    );

                };

            }
            else{

                button.style.visibility =
                    "hidden";

                button.innerHTML = "";

            }

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

    if(game.mode === MODES.daily){

        markDailyDone();

    }

    setTimeout(()=>{

        if(
            game.mode === MODES.twoPlayer &&
            game.lives > 0
        ){

            game.currentPlayer =
                1 - game.currentPlayer;

        }

        nextQuestion();

    },1000);


}




function correctAnswer(button){


    button.classList.add("correct");

    const points =
        game.scoreMultiplier *
        applyScoreMultiplier();

    game.score += points;

    if(game.mode === MODES.twoPlayer){

        const player =
            game.players[game.currentPlayer];

        player.score += points;

        player.streak++;

        if(player.streak > player.bestStreak){

            player.bestStreak =
                player.streak;

        }

    }

    game.streak++;


    game.correctAnswers++;


    increasePowerupMeter();



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

    if(game.mode === MODES.twoPlayer){

        const player =
            game.players[game.currentPlayer];

        player.streak = 0;

    }

    if(game.mode !== MODES.casual){

        game.lives--;

    }

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


    if(
        game.mode !== MODES.twoPlayer &&
        game.mode !== MODES.daily
    ){

        if(game.score > game.bestScore){


            game.bestScore =
                game.score;


            localStorage.setItem(
                "bestScore",
                game.bestScore
            );


        }

    }

    showGameOver();

}
