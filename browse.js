let allQuestions = [];

let searchQuery = "";
let selectedTag = "";

window.addEventListener("DOMContentLoaded", async () => {
    try {
        allQuestions = await loadQuestionsData();
        buildTagSelect();
        renderFlags(allQuestions);
    } catch (error) {
        document.getElementById("flagList").innerHTML =
            "<p>Failed to load flags.</p>";
    }
});

function buildTagSelect() {
    const select = document.getElementById("tagSelect");
    if (!select) return;
    const tags = new Set();
    allQuestions.forEach(q => q.tags.forEach(t => tags.add(t)));
    const sorted = [...tags].sort();
    select.innerHTML =
        `<option value="">All tags</option>` +
        sorted.map(t => `<option value="${t}">${t}</option>`).join("");
    select.addEventListener("change", () => {
        selectedTag = select.value;
        renderFlags(filterQuestions());
    });
}

function filterQuestions() {
    const q = searchQuery;
    return allQuestions.filter(question =>
        (!q ||
            question.question.toLowerCase().includes(q) ||
            question.answers[question.correct].toLowerCase().includes(q)) &&
        (!selectedTag || question.tags.includes(selectedTag))
    );
}

function renderFlags(questions) {
    const list = document.getElementById("flagList");
    if (!list) return;

    if (questions.length === 0) {
        list.innerHTML = "<p>No flags found.</p>";
        return;
    }

    list.innerHTML = questions.map(q => {
        const isBorder = q.tags.includes("border");
        const cardClass = isBorder ? "flagCard borderCard" : "flagCard";
        const badge = isBorder ? '<span class="borderBadge">Outline</span>' : "";
        return `<div class="${cardClass}" onclick="toggleAnswers(this)">
            <img src="${q.image}" alt="${q.question}" loading="lazy">
            ${badge}
            <p>${q.question}</p>
            <p class="flagCorrect">${q.answers[q.correct]}</p>
            <div class="flagAnswers" hidden>
                ${q.answers.map((a, i) =>
                    `<p class="${i === q.correct ? "answerCorrect" : ""}">${i === q.correct ? "✔ " : ""}${a}</p>`
                ).join("")}
            </div>
        </div>`;
    }).join("");
}

function toggleAnswers(card) {
    const answers = card.querySelector(".flagAnswers");
    if (answers) answers.hidden = !answers.hidden;
}

const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value.toLowerCase();
        renderFlags(filterQuestions());
    });
}

const clearButton = document.getElementById("clearFilters");
if (clearButton) {
    clearButton.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        const select = document.getElementById("tagSelect");
        if (select) select.value = "";
        searchQuery = "";
        selectedTag = "";
        renderFlags(allQuestions);
    });
}
