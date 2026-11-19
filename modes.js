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
// and the buttons become flag images from the pool. Preserve the current
// answer count so Hard + Reverse presents eight flags, rather than four.
function buildReverseQuestion(question) {
    if(question.isDoubleTrouble){
        return buildDoubleTroubleReverseQuestion(question);
    }

    const others = game.questions.filter(q => q !== question);
    shuffleArray(others);
    const images = [question.image];
    // Hard mode always needs eight flag choices. Using the selected mode
    // directly keeps this correct even if another modifier rebuilt answers.
    const answerCount = game.mode === MODES.hard ? 8 : question.answers.length;
    others.slice(0, answerCount - 1).forEach(q => images.push(q.image));
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

// Builds a two-flag question with country-pair answers. Hard mode expands
// the choices to eight pairs, matching its usual answer count.
function buildDoubleTroubleQuestion(firstQuestion) {
    const pool = game.questions.filter(q => q !== firstQuestion);
    shuffleArray(pool);

    const secondQuestion = pool.shift();
    if(!secondQuestion) return firstQuestion;

    const firstName = firstQuestion.answers[firstQuestion.correct];
    const secondName = secondQuestion.answers[secondQuestion.correct];
    const correctPair = firstName + " + " + secondName;
    const answerCount = game.mode === MODES.hard ? 8 : 4;
    const pairs = [{
        text: correctPair,
        images: [firstQuestion.image, secondQuestion.image]
    }];

    for(let i = 0; pairs.length < answerCount && i + 1 < pool.length; i += 2){
        const left = pool[i];
        const right = pool[i + 1];
        const text = left.answers[left.correct] + " + " + right.answers[right.correct];
        if(!pairs.some(pair => pair.text === text)){
            pairs.push({ text, images: [left.image, right.image] });
        }
    }

    shuffleArray(pairs);
    return {
        question: "Which two flags are shown?",
        images: [firstQuestion.image, secondQuestion.image],
        answers: pairs.map(pair => pair.text),
        answerImages: pairs.map(pair => pair.images),
        correct: pairs.findIndex(pair => pair.text === correctPair),
        tags: [...firstQuestion.tags, ...secondQuestion.tags],
        answerText: correctPair,
        isDoubleTrouble: true
    };
}

function buildDoubleTroubleReverseQuestion(question) {
    return {
        question: question.answers[question.correct],
        image: null,
        answers: question.answerImages,
        correct: question.correct,
        tags: question.tags,
        answerText: question.answerText,
        isDoubleTrouble: true,
        isReverseDoubleTrouble: true
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
