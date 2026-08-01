const fs = require("fs");
const readline = require("readline");

const CSV_PATH = "questions.csv";
const PASSWORD = "flagquiz2026";

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Usage: node add-question.js <flag_image_url>");
    console.log("Example: node add-question.js https://example.com/flag.png");
    process.exit(1);
}

const imageUrl = args[0];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => {
        rl.question(question, resolve);
    });
}

async function main() {
    const password = await ask("Enter admin password: ");

    if (password !== PASSWORD) {
        console.log("Access denied.");
        rl.close();
        process.exit(1);
    }

    console.log("\n--- AI Question Generator ---");
    console.log("Flag URL: " + imageUrl);
    console.log("I will generate the question, answer options, and correct answer number.");
    console.log("Please review and confirm.\n");

    const question = await ask("Question text (e.g., \"What country is this?\"): ");
    if (!question.trim()) {
        console.log("Question cannot be empty.");
        rl.close();
        process.exit(1);
    }

    const opt1 = await ask("Option 1: ");
    const opt2 = await ask("Option 2: ");
    const opt3 = await ask("Option 3: ");
    const opt4 = await ask("Option 4: ");

    if (!opt1.trim() || !opt2.trim() || !opt3.trim() || !opt4.trim()) {
        console.log("All options are required.");
        rl.close();
        process.exit(1);
    }

    let correctIndex = await ask("Correct option number (1-4): ");
    const correctNum = parseInt(correctIndex);

    if (isNaN(correctNum) || correctNum < 1 || correctNum > 4) {
        console.log("Invalid option number. Must be 1-4.");
        rl.close();
        process.exit(1);
    }

    const csvLine = `${question}\t${imageUrl}\t${opt1}\t${opt2}\t${opt3}\t${opt4}\t${correctNum}`;

    const confirm = await ask(`\nAdd this question to CSV?\n  ${csvLine}\n\nConfirm (y/n): `);

    if (confirm.toLowerCase() === "y") {
        fs.appendFileSync(CSV_PATH, "\n" + csvLine);
        console.log("Question added successfully!");
    } else {
        console.log("Question discarded.");
    }

    rl.close();
}

main();