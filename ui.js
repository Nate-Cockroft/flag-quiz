// ========================================
// Flag Quiz V2
// User Interface Controller
// ========================================


function updateUI(){


    const score =
        document.getElementById("score");


    const streak =
        document.getElementById("streak");



    if(score){

        if(game.mode === MODES.twoPlayer){

            score.textContent =
                game.players[game.currentPlayer].score;

            score.classList.toggle(
                "p1",
                game.currentPlayer === 0
            );

            score.classList.toggle(
                "p2",
                game.currentPlayer === 1
            );

        }
        else{

            score.textContent =
                game.score;

            score.classList.remove(
                "p1",
                "p2"
            );

        }

    }



    if(streak){

        if(game.mode === MODES.twoPlayer){

            streak.textContent =
                game.players[game.currentPlayer].streak;

            streak.classList.toggle(
                "p1",
                game.currentPlayer === 0
            );

            streak.classList.toggle(
                "p2",
                game.currentPlayer === 1
            );

        }
        else{

            streak.textContent =
                game.streak;

            streak.classList.remove(
                "p1",
                "p2"
            );

        }

    }



    updateLives();


}





function updateLives(){

    if(game.mode === MODES.casual){

        const livesEl =
            document.querySelector(".lives");

        if(livesEl){

            livesEl.style.display = "none";

            livesEl.classList.remove(
                "twoPlayerLives"
            );

        }

        return;

    }

    if(game.mode === MODES.twoPlayer){

        const livesEl =
            document.querySelector(".lives");

        if(livesEl){

            livesEl.style.display = "";

            livesEl.classList.add(
                "twoPlayerLives"
            );

            livesEl.innerHTML = "";

            game.players.forEach(
                (player, playerIndex) => {

                    const row =
                        document.createElement("div");

                    row.className =
                        "livesRow" +
                        (playerIndex ===
                            game.currentPlayer
                                ? " active"
                                : "");

                    const label =
                        document.createElement("span");

                    label.className =
                        "livesLabel " +
                        (playerIndex === 0
                            ? "p1"
                            : "p2");

                    label.textContent =
                        player.name;

                    row.appendChild(label);

                    for(
                        let i = 1;
                        i <= game.maxLives;
                        i++
                    ){

                        const heart =
                            document.createElement("span");

                        heart.className = "heart";

                        heart.textContent =
                            i <= player.lives
                                ? "❤️"
                                : "🤍";

                        row.appendChild(heart);

                    }

                    livesEl.appendChild(row);

                }
            );

        }

        return;

    }

    const livesEl =
        document.querySelector(".lives");

    if(livesEl){

        livesEl.style.display = "";

        livesEl.classList.remove(
            "twoPlayerLives"
        );

    }

    for(
        let i = 1;
        i <= game.maxLives;
        i++
    ){


        const heart =
            document.getElementById(
                "heart"+i
            );



        if(!heart){

            continue;

        }



        if(i <= game.lives){


            heart.textContent =
                "❤️";


            heart.classList.remove(
                "lost"
            );


        }
        else{


            heart.textContent =
                "🤍";


            heart.classList.add(
                "lost"
            );


        }

    }


}




function showGameOver(){


    const flagCard =
        document.querySelector(
            ".flagCard"
        );


    const gameOver =
        document.getElementById(
            "gameOver"
        );



    if(flagCard){

        flagCard.classList.add(
            "hidden"
        );

    }



    if(gameOver){

        gameOver.classList.remove(
            "hidden"
        );

    }



    const finalScore =
        document.getElementById(
            "finalScore"
        );


    const bestScore =
        document.getElementById(
            "bestScoreEnd"
        );


    const bestStreak =
        document.getElementById(
            "bestStreakEnd"
        );

    const gameOverTitle =
        document.getElementById(
            "gameOverTitle"
        );



    if(finalScore){

        if(game.mode === MODES.twoPlayer){

            finalScore.textContent =
                game.players[game.currentPlayer].score;

        }
        else{

            finalScore.textContent =
                game.score;

        }

    }


    if(bestScore){

        if(game.mode === MODES.twoPlayer){

            const p1 =
                game.players[0].score;

            const p2 =
                game.players[1].score;

            const winner =
                p1 === p2
                    ? "It's a tie!"
                    : (p1 > p2
                        ? game.players[0].name + " wins!"
                        : game.players[1].name + " wins!");

            bestScore.textContent =
                game.players[0].name + ": " +
                p1 +
                "  |  " +
                game.players[1].name + ": " +
                p2 +
                "  —  " +
                winner;

        }
        else if(game.mode === MODES.daily){

            bestScore.textContent =
                "Come back tomorrow for a new flag!";

        }
        else{

            bestScore.textContent =
                game.bestScore;

        }

    }


    if(bestStreak){

        if(game.mode === MODES.twoPlayer){

            const p1 =
                game.players[0];

            const p2 =
                game.players[1];

            bestStreak.textContent =
                p1.name + " streak: " +
                p1.bestStreak +
                "  |  " +
                p2.name + " streak: " +
                p2.bestStreak;

        }
        else{

            bestStreak.textContent =
                game.bestStreak;

        }

    }

    if(gameOverTitle){

        if(game.mode === MODES.daily){

            gameOverTitle.textContent =
                "Daily Flag Complete!";

        }
        else if(game.mode === MODES.twoPlayer){

            gameOverTitle.textContent =
                "Game Complete!";

        }
        else if(game.mode === MODES.casual){

            gameOverTitle.textContent =
                "Session Ended";

        }
        else{

            gameOverTitle.textContent =
                "Game Over";

        }

    }


    const missed =
        document.getElementById(
            "missedAnswer"
        );


    if(
        missed &&
        game.currentQuestion
    ){

        if(isReverseActive()){

            const name =
                game.currentQuestion.answerText ||
                "?";

            const imageUrl =
                game.answerImageMap &&
                game.answerImageMap[name.toLowerCase()];

            missed.textContent =
                "Answer: " + name;

            if(imageUrl){

                missed.innerHTML =
                    "Answer: " + name +
                    ' <img src="' + imageUrl +
                    '" alt="" class="missedFlag">';

            }

        }
        else{

            missed.textContent =
                "Answer: " +
                game.currentQuestion.answers[
                    game.currentQuestion.correct
                ];

        }

    }


}




function showCorrect(button){


    button.classList.add(
        "correct"
    );


}



function showWrong(button){


    button.classList.add(
        "wrong"
    );


}


function updateModeUI(){

    const modeBadge =
        document.getElementById(
            "modeBadge"
        );

    if(modeBadge){

        modeBadge.textContent =
            MODE_LABELS[game.mode] || "";

    }


    const turnIndicator =
        document.getElementById(
            "turnIndicator"
        );

    if(turnIndicator){

        if(game.mode === MODES.twoPlayer){

            const player =
                game.players[game.currentPlayer];

            const playerIndex =
                game.currentPlayer + 1;

            turnIndicator.textContent =
                player.name + "'s turn";

            turnIndicator.classList.add(
                "visible"
            );

            turnIndicator.classList.toggle(
                "p1",
                playerIndex === 1
            );

            turnIndicator.classList.toggle(
                "p2",
                playerIndex === 2
            );

            const flagCard =
                document.querySelector(
                    ".flagCard"
                );

            if(flagCard){

                flagCard.classList.toggle(
                    "p1",
                    playerIndex === 1
                );

                flagCard.classList.toggle(
                    "p2",
                    playerIndex === 2
                );

            }

        }
        else{

            turnIndicator.classList.remove(
                "visible",
                "p1",
                "p2"
            );

            const flagCard =
                document.querySelector(
                    ".flagCard"
                );

            if(flagCard){

                flagCard.classList.remove(
                    "p1",
                    "p2"
                );

            }

        }

    }


    const endGameBtn =
        document.getElementById(
            "endGameBtn"
        );

    if(endGameBtn){

        if(
            game.mode === MODES.casual
        ){

            endGameBtn.classList.remove(
                "hidden"
            );

        }
        else{

            endGameBtn.classList.add(
                "hidden"
            );

        }

    }


    const extraAnswers =
        document.querySelectorAll(
            ".answerExtra"
        );

    const answersContainer =
        document.getElementById(
            "answersContainer"
        );

    if(answersContainer){

        if(game.mode === MODES.hard){

            answersContainer.classList.add(
                "answersHard"
            );

        }
        else{

            answersContainer.classList.remove(
                "answersHard"
            );

        }

    }

}


function openZoom(imageEl){

    const overlay =
        document.getElementById(
            "zoomOverlay"
        );

    const zoomImage =
        document.getElementById(
            "zoomImage"
        );

    if(!overlay || !zoomImage) return;

    zoomImage.src =
        imageEl.src;

    overlay.classList.remove(
        "hidden"
    );

}


function closeZoom(){

    const overlay =
        document.getElementById(
            "zoomOverlay"
        );

    if(overlay){

        overlay.classList.add(
            "hidden"
        );

    }

}


function setupZoomTriggers(){


    const flagImage =
        document.getElementById(
            "flagImage"
        );

    if(flagImage){

        flagImage.addEventListener(
            "click",
            () => {

                if(flagImage.src){

                    openZoom(flagImage);

                }

            }
        );

        flagImage.classList.add(
            "zoomable"
        );

    }


    const overlay =
        document.getElementById(
            "zoomOverlay"
        );

    if(overlay){

        overlay.addEventListener(
            "click",
            closeZoom
        );

    }

}
