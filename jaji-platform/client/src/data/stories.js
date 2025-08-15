const KEY = "jaji_stories_v1";
const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
const write = (list) => localStorage.setItem(KEY, JSON.stringify(list));

export function getStories() {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}
export async function fileToDataURL(file) {
  if (!file) return "";
  const dataUrl = await new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
  return dataUrl;
}
export async function addStory({ file, author = "Jaji", avatar = "https://i.pravatar.cc/100?img=2" }) {
  const media = await fileToDataURL(file);
  const type = file.type.startsWith("video/") ? "video" : "image";
  const list = read();
  const item = { id: `s_${Date.now()}`, author, avatar, media, type, createdAt: Date.now() };
  write([item, ...list]);
  return item;
}
