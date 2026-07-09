let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById("question");
const flagElement = document.getElementById("flag");
const answerButtons = document.querySelectorAll(".answer");
const scoreElement = document.getElementById("score");
const nextButton = document.getElementById("next");

const quizSection = document.getElementById("quiz");
const finishedSection = document.getElementById("finished");
const finalScoreElement = document.getElementById("finalScore");

async function loadQuestions() {

    const response = await fetch("questions.json");
    questions = await response.json();

    shuffleArray(questions);

    loadQuestion();
}

function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

}

function loadQuestion() {

    nextButton.style.display = "none";

    const question = questions[currentQuestionIndex];

    questionElement.textContent = question.question;
    flagElement.src = question.image;

    let answers = [
        question.correct,
        ...question.wrong
    ];

    shuffleArray(answers);

    answerButtons.forEach((button, index) => {

        button.disabled = false;
        button.classList.remove("correct", "wrong");

        button.textContent = answers[index];

        button.onclick = () => {

            answerButtons.forEach(btn => btn.disabled = true);

            const selectedAnswer = answers[index];

            if (selectedAnswer === question.correct) {

                score++;

                scoreElement.textContent =
                    `Score: ${score}`;

                button.classList.add("correct");

            } else {

                button.classList.add("wrong");

                answerButtons.forEach(btn => {

                    if (btn.textContent === question.correct) {
                        btn.classList.add("correct");
                    }

                });

            }

            nextButton.style.display = "inline-block";
        };

    });

}

nextButton.addEventListener("click", () => {

    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {

        finishQuiz();

    } else {

        loadQuestion();

    }

});

function finishQuiz() {

    quizSection.classList.add("hidden");

    finishedSection.classList.remove("hidden");

    finalScoreElement.textContent =
        `You scored ${score} out of ${questions.length}`;

}

loadQuestions();
