let allQuestions = [];

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("questions.csv");
        const csv = await response.text();
        allQuestions = parseCSV(csv);
        renderFlags(allQuestions);
    } catch (error) {
        document.getElementById("flagList").innerHTML =
            "<p>Failed to load flags.</p>";
    }
});

function parseCSV(csv) {
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
            correct: Number(values[6]) - 1
        });
    });
    return questions;
}

function renderFlags(questions) {
    const list = document.getElementById("flagList");
    if (!list) return;

    if (questions.length === 0) {
        list.innerHTML = "<p>No flags found.</p>";
        return;
    }

    list.innerHTML = questions.map(q =>
        `<div class="flagCard">
            <img src="${q.image}" alt="${q.question}" loading="lazy">
            <p>${q.question}</p>
            <p class="flagAnswers">${q.answers.join(" | ")}</p>
        </div>`
    ).join("");
}

const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = allQuestions.filter(q =>
            q.question.toLowerCase().includes(query) ||
            q.answers.some(a => a.toLowerCase().includes(query))
        );
        renderFlags(filtered);
    });
}