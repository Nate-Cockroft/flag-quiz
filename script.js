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

        setupGame();

        updateUI();

        nextQuestion();

    }

    catch(error){

        console.error(error);

        alert("Failed to load questions.csv");

    }

});
