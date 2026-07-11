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

        score.textContent =
            game.score;

    }



    if(streak){

        streak.textContent =
            game.streak;

    }



    updateLives();


}





function updateLives(){


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



    if(finalScore){

        finalScore.textContent =
            game.score;

    }


    if(bestScore){

        bestScore.textContent =
            game.bestScore;

    }


    if(bestStreak){

        bestStreak.textContent =
            game.bestStreak;

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
