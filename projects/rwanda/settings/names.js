export function formatNames(id, names) {
  const nameTexts = names.filter((x) => x.text);

  if (nameTexts.length > 0) {
    return nameTexts.map((x) => `${x.text}`).join(`</br>`);
  } else {
    return "No name registered.";
  }
}