import type { Name } from "./types";

export function formatNames(
  id: number | undefined | string,
  names: Array<Name>
): string {
  const nameTexts = names.filter((x: Name) => x.text);
  
  if (nameTexts.length > 0) {
    return nameTexts.map((x: Name) => `${x.text}`).join(`</br>`);
  } else {
    return "No name registered.";
  }
}
