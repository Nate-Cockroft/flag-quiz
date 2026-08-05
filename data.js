// ========================================
// Flag Quiz
// Shared question loader with session cache
// ========================================

const QUESTIONS_CACHE_KEY = "flagquiz.questions.v2";
const CSV_URL = "questions.csv";
const EXCLUDED_KEY = "excludedTags";
const DEFAULT_EXCLUDED_TAGS = ["border"];

// Returns which tags are filtered out of the quiz. Borders are excluded
// unless the user explicitly enables them via the tag filter.
function loadExcludedTags() {
    try {
        const val = JSON.parse(localStorage.getItem(EXCLUDED_KEY));
        return Array.isArray(val) ? val : [...DEFAULT_EXCLUDED_TAGS];
    } catch (error) {
        return [...DEFAULT_EXCLUDED_TAGS];
    }
}

function saveExcludedTags(list) {
    localStorage.setItem(EXCLUDED_KEY, JSON.stringify(list));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function parseQuestionsCSV(csv) {
    const lines = csv.trim().split(/\r?\n/);
    lines.shift();
    const questions = [];
    lines.forEach(line => {
        const values = line.split("\t");
        if (!values[1]) return;
        questions.push({
            question: values[0],
            image: values[1],
            answers: [values[2], values[3], values[4], values[5]],
            correct: Number(values[6]) - 1,
            tags: values[7]
                ? values[7].split(",").map(t => t.trim()).filter(Boolean)
                : []
        });
    });
    return questions;
}

// Loads questions.csv once per browser session and reuses the parsed
// result across pages instead of fetching + re-parsing on every visit.
async function loadQuestionsData() {
    try {
        const cached = sessionStorage.getItem(QUESTIONS_CACHE_KEY);
        if (cached) return JSON.parse(cached);
    } catch (error) {
        // ignore corrupt cache
    }
    const response = await fetch(CSV_URL);
    if (!response.ok) {
        throw new Error("Could not load questions.csv");
    }
    const csv = await response.text();
    const parsed = parseQuestionsCSV(csv);
    try {
        sessionStorage.setItem(QUESTIONS_CACHE_KEY, JSON.stringify(parsed));
    } catch (error) {
        // ignore quota errors
    }
    return parsed;
}
