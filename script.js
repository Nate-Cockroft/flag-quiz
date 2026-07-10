let questions = [];

let availableQuestions = [];

let score = 0;
let streak = 0;
let lives = 5;

let bestScore = Number(localStorage.getItem("bestScore")) || 0;
let bestStreak = Number(localStorage.getItem("bestStreak")) || 0;


const scoreText = document.getElementById("score");
const streakText = document.getElementById("streak");
const livesText = document.getElementById("lives");

const questionText = document.getElementById("question");
const flagImage = document.getElementById("flagImage");

const buttons = document.querySelectorAll(".answer");

const gameOver = document.getElementById("gameOver");

const finalScore = document.getElementById("finalScore");
const bestScoreEnd = document.getElementById("bestScoreEnd");
const bestStreakEnd = document.getElementById("bestStreakEnd");



async function startGame(){

    const csv = await fetch("questions.csv")
        .then(response => response.text());


    questions = parseCSV(csv);

    shuffleArray(questions);

    availableQuestions = [...questions];

    updateStats();

    nextQuestion();

}



function parseCSV(csv){

    const lines = csv
        .trim()
        .split("\n");


    const headers = lines[0]
        .split(",");


    return lines.slice(1).map(line=>{

        const values = line.split(",");


        return {

            question: values[0],

            image: values[1],

            answers:[
                values[2],
                values[3],
                values[4],
                values[5]
            ],

            correct:
                Number(values[6])-1

        };


    });

}



function nextQuestion(){

    if(lives <= 0){
        endGame();
        return;
    }



    if(availableQuestions.length === 0){

        availableQuestions = [...questions];

        shuffleArray(availableQuestions);

    }



    const randomIndex =
        Math.floor(Math.random()*availableQuestions.length);


    const current =
        availableQuestions.splice(randomIndex,1)[0];



    questionText.textContent =
        current.question;


    flagImage.src =
        current.image;



    let answers =
        current.answers.map((answer,index)=>{

            return {

                text:answer,

                correct:
                    index === current.correct

            };

        });



    shuffleArray(answers);



    buttons.forEach((button,index)=>{


        button.disabled=false;

        button.className="answer";


        button.textContent =
            answers[index].text;



        button.onclick=function(){

            checkAnswer(
                button,
                answers[index].correct
            );

        };


    });

}



function checkAnswer(button,isCorrect){


    buttons.forEach(btn=>{
        btn.disabled=true;
    });



    if(isCorrect){


        score++;

        streak++;


        button.classList.add("correct");



        if(streak > bestStreak){

            bestStreak = streak;

            localStorage.setItem(
                "bestStreak",
                bestStreak
            );

        }


    }


    else{


        button.classList.add("wrong");


        lives--;

        streak=0;



        buttons.forEach(btn=>{

            if(
                btn.textContent ===
                getCorrectAnswer()
            ){

                btn.classList.add("correct");

            }

        });


    }



    if(score > bestScore){

        bestScore = score;

        localStorage.setItem(
            "bestScore",
            bestScore
        );

    }



    updateStats();



    setTimeout(()=>{


        if(lives <=0){

            endGame();

        }

        else{

            nextQuestion();

        }


    },1000);


}



function getCorrectAnswer(){

    return buttons[0].textContent;

}



function updateStats(){

    scoreText.textContent =
        score;


    streakText.textContent =
        streak;



    livesText.textContent =
        "❤️".repeat(lives);



}



function endGame(){

    document.querySelector(".flagCard")
        .classList.add("hidden");


    gameOver.classList.remove("hidden");



    finalScore.textContent =
        score;


    bestScoreEnd.textContent =
        bestScore;


    bestStreakEnd.textContent =
        bestStreak;


}



function shuffleArray(array){

    for(
        let i=array.length-1;
        i>0;
        i--
    ){

        let j =
            Math.floor(Math.random()*(i+1));


        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }

}



startGame();
