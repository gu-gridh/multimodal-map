import type Feature from "ol/Feature";
import type { Item } from "../types/map";

// Converts an OL feature into a searchable Item with ID and name
export function featureToItem(feature: Feature) {
  const item = { id: feature?.get("id"), name: feature?.get("name") } as Item;

  return item;
}

// Determines if the feature has a unique ID and is thus searchable
export function searchableItem(feature: Feature) {
  // return feature.get("id") && feature.get("name");
  return feature;
}
