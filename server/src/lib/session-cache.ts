const SESSION_CACHE_TTL_MS = 60_000;

type SessionCacheEntry = {
  active: boolean;
  expiresAt: number;
};

const sessionCache = new Map<string, SessionCacheEntry>();

function isExpired(entry: SessionCacheEntry) {
  return entry.expiresAt <= Date.now();
}

export function getCachedSessionState(sessionId: string) {
  const entry = sessionCache.get(sessionId);
  if (!entry) {
    return null;
  }

  if (isExpired(entry)) {
    sessionCache.delete(sessionId);
    return null;
  }

  return entry.active;
}

export function markSessionActive(sessionId: string) {
  sessionCache.set(sessionId, {
    active: true,
    expiresAt: Date.now() + SESSION_CACHE_TTL_MS,
  });
}

export function markSessionRevoked(sessionId: string) {
  sessionCache.set(sessionId, {
    active: false,
    expiresAt: Date.now() + SESSION_CACHE_TTL_MS,
  });
}

export function invalidateSessionCache(sessionId: string) {
  sessionCache.delete(sessionId);
}
