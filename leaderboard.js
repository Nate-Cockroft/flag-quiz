async function submitScore(name, score, streak, accuracy) {
    try {
        const response = await fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, score, streak, accuracy })
        });
        return response.json();
    } catch (error) {
        return null;
    }
}

async function getLeaderboard(limit = 10) {
    try {
        const response = await fetch(`/api/leaderboard?limit=${limit}`);
        return response.json();
    } catch (error) {
        return null;
    }
}
