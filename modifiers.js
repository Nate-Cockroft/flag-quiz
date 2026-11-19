// ========================================
// Flag Quiz V2
// Game Modifiers
// ========================================

const MODIFIER_KEY = "flagquiz.modifiers";

const MODIFIERS = {
    reverse: "reverse",
    wrongPick: "wrongPick",
    timeAttack: "timeAttack",
    oneLife: "oneLife",
    noFiftyFifty: "noFiftyFifty",
    noSkip: "noSkip",
    noDoubleScore: "noDoubleScore",
    zoomedIn: "zoomedIn",
    blurredFlag: "blurredFlag",
    grayerFlag: "grayerFlag",
    doubleTrouble: "doubleTrouble",
    capitalQuestions: "capitalQuestions",
    speedBonus: "speedBonus",
    noMercy: "noMercy"
};

const MODIFIER_DEFS = [
    {
        id: "reverse",
        icon: "🔁",
        name: "Reverse",
        desc: "See the name, pick the flag.",
        multiplier: 1.0
    },
    {
        id: "wrongPick",
        icon: "❌",
        name: "Wrong Pick",
        desc: "See the name, tap the 3 wrong flags.",
        multiplier: 1.25
    },
    {
        id: "timeAttack",
        icon: "⏱",
        name: "Time Attack",
        desc: "10s per question. Timeout counts as wrong.",
        multiplier: 1.5
    },
    {
        id: "oneLife",
        icon: "💀",
        name: "One Life",
        desc: "Game over on your first mistake.",
        multiplier: 2
    },
    {
        id: "noFiftyFifty",
        icon: "🚫",
        name: "No 50/50",
        desc: "50/50 powerups are unavailable.",
        multiplier: 1.05
    },
    {
        id: "noSkip",
        icon: "🚫",
        name: "No Skip",
        desc: "Skip powerups are unavailable.",
        multiplier: 1.05
    },
    {
        id: "noDoubleScore",
        icon: "🚫",
        name: "No Double Score",
        desc: "Double Score powerups are unavailable.",
        multiplier: 1.05
    },
    {
        id: "zoomedIn",
        icon: "🔍",
        name: "Zoomed In",
        desc: "Identify a randomly cropped part of the flag.",
        multiplier: 1.25
    },
    {
        id: "blurredFlag",
        icon: "🌫️",
        name: "Blurred Flag",
        desc: "Identify a flag with a blur.",
        multiplier: 1.15
    },
    {
        id: "grayerFlag",
        icon: "◻️",
        name: "Washed Out",
        desc: "Identify a flag with muted colours.",
        multiplier: 1.1
    },
    {
        id: "doubleTrouble",
        icon: "👯",
        name: "Double Trouble",
        desc: "See two flags and identify the country pair.",
        multiplier: 1.5
    },
    {
        id: "capitalQuestions",
        icon: "🏛️",
        name: "Capital Questions",
        desc: "Identify the capital of a modern country.",
        multiplier: 1.25
    },
    {
        id: "speedBonus",
        icon: "⚡",
        name: "Speed Bonus",
        desc: "Answer in under 5s for bonus points.",
        multiplier: 1.25
    },
    {
        id: "noMercy",
        icon: "💔",
        name: "No Mercy",
        desc: "Wrong answers cost 2 lives.",
        multiplier: 1.5
    }
];

const TIME_ATTACK_SECONDS = 10;
const SPEED_BONUS_SECONDS = 5;
const SPEED_BONUS_MULTIPLIER = 0.5;

function loadModifiers() {
    try {
        const raw = localStorage.getItem(MODIFIER_KEY);
        const list = raw ? JSON.parse(raw) : [];
        return list.filter(m => MODIFIERS[m]);
    }
    catch (e) {
        return [];
    }
}

function saveModifiers(list) {
    const clean = list.filter(m => MODIFIERS[m]);
    localStorage.setItem(MODIFIER_KEY, JSON.stringify(clean));
}

function hasModifier(id) {
    return loadModifiers().includes(id);
}

function getModifierMultiplier() {
    return loadModifiers().reduce((total, id) => {
        const def = MODIFIER_DEFS.find(d => d.id === id);
        return def ? total * def.multiplier : total;
    }, 1);
}

function isReverseActive() {
    return (
        game.mode === MODES.reverse ||
        hasModifier(MODIFIERS.reverse) ||
        hasModifier(MODIFIERS.wrongPick)
    );
}

function isDoubleTroubleActive() {
    return hasModifier(MODIFIERS.doubleTrouble);
}

function isCapitalQuestionsActive() {
    return hasModifier(MODIFIERS.capitalQuestions);
}

function getModifierConflicts(id) {
    if(id === MODIFIERS.capitalQuestions) return [MODIFIERS.doubleTrouble];
    if(id === MODIFIERS.doubleTrouble) return [MODIFIERS.capitalQuestions];
    return [];
}


function isWrongPickActive() {
    return hasModifier(MODIFIERS.wrongPick);
}

function isPowerupDisabled(powerup) {
    const modifierByPowerup = {
        fiftyFifty: MODIFIERS.noFiftyFifty,
        skip: MODIFIERS.noSkip,
        doubleScore: MODIFIERS.noDoubleScore
    };
    return hasModifier(modifierByPowerup[powerup]);
}
