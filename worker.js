const LEADERBOARD_KV = LEADERBOARD_KV;
const MAX_ENTRIES = 50;

async function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/api/leaderboard' && request.method === 'GET') {
        return getLeaderboard(request, url);
    }

    if (path === '/api/leaderboard' && request.method === 'POST') {
        return submitScore(request);
    }

    return new Response('Not found', { status: 404 });
}

async function getLeaderboard(request, url) {
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const data = await LEADERBOARD_KV.list();
    const entries = [];

    for (const key of data.keys) {
        const value = await LEADERBOARD_KV.get(key.name);
        if (value) {
            entries.push(JSON.parse(value));
        }
    }

    entries.sort((a, b) => b.score - a.score);
    const top = entries.slice(0, limit);

    return new Response(JSON.stringify(top), {
        headers: { 'Content-Type': 'application/json' }
    });
}

async function submitScore(request) {
    const body = await request.json();
    const { name, score, streak, accuracy } = body;

    if (!name || !score) {
        return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const entry = {
        name: name.substring(0, 20),
        score: Number(score),
        streak: Number(streak) || 0,
        accuracy: Number(accuracy) || 0,
        timestamp: Date.now()
    };

    const key = `entry_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    await LEADERBOARD_KV.put(key, JSON.stringify(entry));

    const data = await LEADERBOARD_KV.list();
    const keys = data.keys.filter(k => k.name.startsWith('entry_'));

    if (keys.length > MAX_ENTRIES) {
        keys.sort((a, b) => a.name.localeCompare(b.name));
        const toDelete = keys.slice(0, keys.length - MAX_ENTRIES);
        await Promise.all(toDelete.map(k => LEADERBOARD_KV.delete(k.name)));
    }

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export default {
    fetch: handleRequest
};