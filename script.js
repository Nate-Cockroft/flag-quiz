// ========================================
// Flag Quiz V2
// Main Script
// ========================================

// Global Game Object
const game = {
    questions: [],
    remainingQuestions: [],
    currentQuestion: null,

    score: 0,
    streak: 0,
    bestScore: Number(localStorage.getItem("bestScore")) || 0,
    bestStreak: Number(localStorage.getItem("bestStreak")) || 0,

    lives: 5,
    maxLives: 5,

    questionsSeen: 0,
    correctAnswers: 0,
    wrongAnswers: 0,

    totalAnswerTime: 0,
    currentQuestionStart: 0,

    scoreMultiplier: 1,

    mode: MODES.classic,
    maxQuestions: null,

    players: [
        { name: "Player 1", score: 0, streak: 0, bestStreak: 0, lives: 5 },
        { name: "Player 2", score: 0, streak: 0, bestStreak: 0, lives: 5 }
    ],
    currentPlayer: 0,

    powerups: {
        fiftyFifty: 0,
        skip: 0,
        doubleScore: 0
    },

    loading: true
};

window.addEventListener("DOMContentLoaded", async () => {

    try {

        await loadQuestions();

        game.mode = loadMode();
        game.maxQuestions = getMaxQuestions(game.mode);

        if(
            game.mode === MODES.daily &&
            isDailyDone()
        ){

            alert(
                "You already completed today's Daily Flag!"
            );

            location.href = "index.html";

            return;

        }

        if(
            game.mode === MODES.daily &&
            game.questions.length > 0
        ){

            const daily =
                getDailyQuestion(game.questions);

            game.questions = [daily];

            resetQuestionPool();

        }

        setupGame();

        setupZoomTriggers();

        updateUI();

        updateModeUI();

        updatePowerupUI();

        nextQuestion();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

});
