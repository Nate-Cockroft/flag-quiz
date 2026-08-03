const CACHE_NAME = "flag-quiz-v6";
const ASSETS = [
    "/",
    "/index.html",
    "/quiz.html",
    "/browse.html",
    "/style.css",
    "/game.js",
    "/questions.js",
    "/ui.js",
    "/stats.js",
    "/powerups.js",
    "/script.js",
    "/browse.js",
    "/questions.csv",
    "/placeholder.svg"
];

// Only pre-warm the image cache on phones/tablets to avoid
// downloading every flag image on desktop browsers.
let isMobile = /Mobi|Android|iPhone|iPod/i.test(navigator.userAgent);

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            cache.addAll(ASSETS)
        )
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        ).then(() =>
            caches.open(CACHE_NAME).then(cache =>
                cache.delete("questions.csv")
            )
        )
    );
    self.clients.claim();
    if (isMobile) warmImageCache();
});

// ---- Offline image pre-warming ----
const warmedImages = new Set();
const WARM_CONCURRENCY = 6;

function imageUrlsFromCSV(csvText) {
    const urls = [];
    const lines = csvText.trim().split(/\r?\n/);
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split("\t");
        if (values[1]) urls.push(values[1]);
    }
    return urls;
}

async function warmImageCache() {
    const cached = await caches.match("questions.csv").catch(() => null);
    if (!cached) return;
    const csvText = await cached.text();
    const urls = imageUrlsFromCSV(csvText);
    const cache = await caches.open(CACHE_NAME);

    let index = 0;
    const worker = async () => {
        while (index < urls.length) {
            const url = urls[index++];
            if (warmedImages.has(url)) continue;
            warmedImages.add(url);
            try {
                const response = await fetch(url);
                if (response && (response.ok || response.type === "opaque")) {
                    await cache.put(url, response);
                }
            } catch (error) {
                // skip images that can't be fetched
            }
        }
    };

    const workers = Array.from(
        { length: Math.min(WARM_CONCURRENCY, urls.length) },
        () => worker()
    );
    await Promise.all(workers);
}

self.addEventListener("fetch", event => {
    const request = event.request;
    const url = request.url;

    if (url.endsWith("questions.csv")) {
        event.respondWith(
            caches.match(request).then(cached => {
                const network = fetch(request)
                    .then(response => {
                        if (response && response.status === 200) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(request, clone);
                                if (isMobile) warmImageCache();
                            });
                        }
                        return response;
                    })
                    .catch(() => cached);
                return cached || network;
            })
        );
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(
            caches.match(request).then(cached => {
                if (cached) return cached;
                return fetch(request)
                    .then(response => {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, clone);
                        });
                        return response;
                    })
                    .catch(() => caches.match("/index.html"));
            })
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(cached => {
            if (cached) return cached;
            return fetch(request)
                .then(response => {
                    if (response && (response.status === 200 || response.type === "opaque")) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, clone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    if (request.destination === "image") {
                        return caches.match("/placeholder.svg");
                    }
                    return new Response("", { status: 504 });
                });
        })
    );
});
