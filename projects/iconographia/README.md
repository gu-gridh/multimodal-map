# Iconographia Mediaevalis Suetica

Vue 3 / Vite rewrite of the legacy `mb-frontend` (Vue 2 + vue-cli), as a
multimodal-map project. Talks to the standalone
[iconographia-backend](../../../digarv-db/iconographia-backend) (Django 5.2 +
DRF) instead of the old PHP digarv endpoints.

## Run

```sh
echo "PROJECT=iconographia" > .env.local
# API base; defaults to http://localhost:8000/api when unset
echo "VITE_API_URL=http://localhost:8000/api" >> .env.local
yarn dev
```

Start the backend first: `python manage.py runserver` in
`iconographia-backend/` (its default CORS settings already allow
`http://localhost:5173`).

## What it does

The layout follows the original mb-frontend: a dark split view with the
**gallery always visible** on the left and a **data pane** (title, search,
filters, embedded map) on the right. Styling is self-contained in
`theme.css` + scoped component styles — the shared `common_styles`
stylesheets are deliberately not used, to avoid class collisions.

- **Collections**: the default "Hela arkivet" browses both collections
  merged — museum objects ("Medeltidens bildvärld", IIIF pyramids) first,
  then the Iconographic Registry cards (plain JPEGs) — exactly the order the
  original Gallery used. Chips narrow to a single collection, which also
  unlocks collection-specific facets (technique).
- **Gallery pane**: masonry view of the current result set, infinite scroll
  + load-more, broken image files degrade to text cards. The gallery follows
  the map: panning/zooming sends the current extent as `?bbox=` (the
  original's "filter the collection by adjusting the map view").
- **Map with counts**: `/api/<layer>/map/` returns one GeoJSON feature per
  place with a record count. Markers are clustered; clusters show the summed
  count, single places show a count badge. All active filters apply to the
  pins. Clicking a place narrows the gallery to it (the legacy `setPlace`
  behaviour) — a removable chip shows the active place filter.
- **Search & facets**: free-text search (incl. registry OCR text) with live
  place suggestions from `/api/place/?search=&has=<collections>` (the legacy
  placeSuggestions; `has` excludes places with zero records),
  category chips (from the legacy CATEGORIES list), technique facet fetched
  live from `/api/ir_motive/values/?field=technique`.
- **Time period**: range slider (1000–1650) mapping to
  `?min_year/?max_year`, with an "include undated" toggle.
- **Detail view** (`/object/:id`, `/ir_motive/:id`): opens in the right
  pane (the gallery stays visible), with an expand button for full screen.
  OpenSeadragon viewer (sequence mode for multiple images), full metadata,
  external links (Kulturarvsdata, Digitalt arkiv RAÄ), collapsible OCR text.
- The map is a plain OpenLayers instance with `constrainResolution: true`
  (integer zoom levels — fractional zooms scale OSM tiles and blur the map).
- Footer: the original's text links (GitHub, API/dataset docs, GRIDH, GU),
  spanning the full window width below both panes.
- Gallery cards show the original hover overlay (type + locality over a
  bottom gradient) in addition to the title row.
- Favicon: the original dopfunt.ico.

i18n: Swedish (default) and English, in `src/translations/iconographia.js`.
