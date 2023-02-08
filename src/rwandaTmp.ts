import type { Name } from "@/types/map";

export function formatNames(
  id: number | undefined | string,
  names: Array<Name>
): string {
  const nameTexts = names.filter((x: Name) => x.text);
  let nameString = `ID: <b>${id}</b></br>`;
  if (nameTexts.length > 0) {
    return nameString + nameTexts.map((x: Name) => `${x.text}`).join(`</br>`);
  } else {
    return nameString + "No name registered.";
  }
}

