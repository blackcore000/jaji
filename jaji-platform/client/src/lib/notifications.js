export function notify(text) {
  try {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification(text);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((p) => {
        if (p === "granted") new Notification(text);
      });
    }
  } catch {}
}
