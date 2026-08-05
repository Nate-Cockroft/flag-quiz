// ========================================
// Flag Quiz V2
// Game Modifiers
// ========================================

const MODIFIER_KEY = "flagquiz.modifiers";

const MODIFIERS = {
    timeAttack: "timeAttack",
    oneLife: "oneLife",
    noPowerups: "noPowerups",
    speedBonus: "speedBonus",
    noMercy: "noMercy"
};

const MODIFIER_DEFS = [
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
        id: "noPowerups",
        icon: "🚫",
        name: "No Powerups",
        desc: "Powerups are disabled.",
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
