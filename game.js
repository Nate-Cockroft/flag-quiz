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
        player.lives = game.maxLives;
    });

    if(game.mode === MODES.casual){

        game.lives = game.maxLives;
        game.maxLives = Infinity;

    }

    if(
        hasModifier(MODIFIERS.oneLife) &&
        game.mode !== MODES.casual
    ){

        game.maxLives = 1;

        game.lives = 1;

        game.players.forEach(player => {

            player.lives = 1;

        });

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

    if(game.mode === MODES.twoPlayer){

        if(
            game.players[game.currentPlayer].lives
            <= 0
        ){

            endGame();

            return;

        }

    }
    else if(
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

    startTimerIfNeeded();

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


    stopTimer();

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

        if(!button){

            const correctButton =
                document.querySelector(
                    '.answer[data-correct="true"]'
                );

            if(correctButton){

                showCorrect(correctButton);

            }

        }

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
            game.players[game.currentPlayer].lives
            > 0
        ){

            game.currentPlayer =
                1 - game.currentPlayer;

        }

        nextQuestion();

    },1000);


}




function correctAnswer(button){


    if(button){

        button.classList.add("correct");

    }

    const answerTime =
        (Date.now()-game.currentQuestionStart)/1000;

    let points =
        game.scoreMultiplier *
        applyScoreMultiplier() *
        getModifierMultiplier();

    if(
        hasModifier(MODIFIERS.speedBonus) &&
        answerTime < SPEED_BONUS_SECONDS
    ){

        points +=
            Math.round(
                points *
                SPEED_BONUS_MULTIPLIER
            );

    }

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


    if(button){

        button.classList.add("wrong");

    }

    const penalty =
        hasModifier(MODIFIERS.noMercy)
            ? 2
            : 1;

    if(game.mode === MODES.twoPlayer){

        const player =
            game.players[game.currentPlayer];

        player.streak = 0;

        player.lives -= penalty;

    }
    else if(game.mode !== MODES.casual){

        game.lives -= penalty;

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


    stopTimer();

    hideTimer();

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




function startTimerIfNeeded(){


    stopTimer();

    if(
        !hasModifier(MODIFIERS.timeAttack) ||
        !game.currentQuestion
    ){

        hideTimer();

        return;

    }


    const bar =
        document.getElementById(
            "timerBar"
        );

    const fill =
        document.getElementById(
            "timerFill"
        );

    if(bar){

        bar.classList.remove("hidden");

    }

    if(fill){

        fill.style.width = "100%";

        fill.style.background = "#4caf50";

    }


    const start = Date.now();

    game.timerInterval = setInterval(() => {

        const elapsed =
            (Date.now()-start)/1000;

        const remaining =
            Math.max(
                0,
                TIME_ATTACK_SECONDS - elapsed
            );

        const pct =
            (remaining / TIME_ATTACK_SECONDS) * 100;

        if(fill){

            fill.style.width = pct + "%";

            fill.style.background =
                pct > 30
                    ? "#4caf50"
                    : (pct > 10
                        ? "#ffd75e"
                        : "#ff5252");

        }

        if(remaining <= 0){

            stopTimer();

            answerQuestion(false, null);

        }

    }, 100);

}




function stopTimer(){


    if(game.timerInterval){

        clearInterval(game.timerInterval);

        game.timerInterval = null;

    }

}




function hideTimer(){


    const bar =
        document.getElementById(
            "timerBar"
        );

    if(bar){

        bar.classList.add("hidden");

    }

}
