// ========================================
// Flag Quiz
// Game Modes
// ========================================

const MODE_KEY = "flagquiz.mode";

const MODES = {
    classic: "classic",
    casual: "casual",
    hard: "hard",
    reverse: "reverse",
    daily: "daily",
    twoPlayer: "two-player"
};

const MODE_LABELS = {
    classic: "Classic",
    casual: "Casual",
    hard: "Hard",
    reverse: "Reverse",
    daily: "Daily Flag",
    twoPlayer: "Two Player"
};

function loadMode() {
    const mode = localStorage.getItem(MODE_KEY);
    return MODES[mode] ? mode : MODES.classic;
}

function saveMode(mode) {
    if (MODES[mode]) {
        localStorage.setItem(MODE_KEY, mode);
    }
}

// Questions per player in two-player mode.
const TWO_PLAYER_QUESTIONS = 10;

// Number of questions per game, or null for endless.
function getMaxQuestions(mode) {
    if (mode === MODES.daily) return 1;
    if (mode === MODES.twoPlayer) return TWO_PLAYER_QUESTIONS * 2;
    return null;
}

// Deterministic day index so every player sees the same flag each day.
function getDayIndex() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.floor(start.getTime() / 86400000);
}

function getDailyKey() {
    const now = new Date();
    return "flagquiz.daily." + now.toISOString().slice(0, 10);
}

function isDailyDone() {
    return localStorage.getItem(getDailyKey()) === "done";
}

function markDailyDone() {
    localStorage.setItem(getDailyKey(), "done");
}

// Picks the single deterministic daily question from the loaded pool.
function getDailyQuestion(pool) {
    if (pool.length === 0) return null;
    return pool[getDayIndex() % pool.length];
}

// Builds 8 options for hard mode: the original 4 plus 4 random
// distractor names pulled from the rest of the pool.
function buildHardAnswers(question) {
    const taken = new Set(question.answers.map(a => a.toLowerCase()));
    const candidates = [];
    game.questions.forEach(q => {
        q.answers.forEach(a => {
            const key = a.toLowerCase();
            if (!taken.has(key)) {
                taken.add(key);
                candidates.push(a);
            }
        });
    });
    shuffleArray(candidates);
    const extra = candidates.slice(0, 4);
    const combined = question.answers.concat(extra);
    const correctText = question.answers[question.correct];
    const shuffled = [...combined];
    shuffleArray(shuffled);
    return {
        answers: shuffled,
        correct: shuffled.indexOf(correctText)
    };
}

// Builds a reverse question: the answer name is shown as the question,
// and the 4 buttons become flag images from the pool.
function buildReverseQuestion(question) {
    const others = game.questions.filter(q => q !== question);
    shuffleArray(others);
    const images = [question.image];
    others.slice(0, 3).forEach(q => images.push(q.image));
    shuffleArray(images);
    return {
        question: question.answers[question.correct],
        image: null,
        answers: images,
        correct: images.indexOf(question.image),
        tags: question.tags,
        answerText: question.answers[question.correct]
    };
}

// One flag image per answer name, used to show the correct flag
// on the reverse-mode game-over screen.
function buildAnswerImageMap(questions) {
    const map = {};
    questions.forEach(q => {
        const answer = q.answers[q.correct];
        if (!(answer.toLowerCase() in map)) {
            map[answer.toLowerCase()] = q.image;
        }
    });
    return map;
}
