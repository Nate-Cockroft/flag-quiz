async function submitScore(name, score, streak, accuracy) {
    const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score, streak, accuracy })
    });
    return response.json();
}

async function getLeaderboard(limit = 10) {
    const response = await fetch(`/api/leaderboard?limit=${limit}`);
    return response.json();
}