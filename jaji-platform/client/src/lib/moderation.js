const bad = ["küfür1","küfür2","küfür3"]; // örnek
export function isClean(text="") {
  const low = text.toLowerCase();
  return !bad.some(w => low.includes(w));
}
