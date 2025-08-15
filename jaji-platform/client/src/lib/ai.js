const API = import.meta.env.VITE_API_URL;

export async function listThreads(uid) {
  const r = await fetch(`${API}/ai/threads?uid=${encodeURIComponent(uid)}`);
  return r.json();
}

export async function getHistory(uid, threadId) {
  const r = await fetch(`${API}/ai/history?uid=${encodeURIComponent(uid)}&threadId=${encodeURIComponent(threadId)}`);
  return r.json();
}

export async function chat(uid, prompt, threadId, lang = "tr", remember = true, userProfile = null) {
  const r = await fetch(`${API}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, prompt, threadId, lang, remember, userProfile }),
  });
  return r.json();
}

export async function deleteThread(uid, threadId) {
  const r = await fetch(`${API}/ai/delete-thread`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, threadId })
  });
  return r.json();
}
