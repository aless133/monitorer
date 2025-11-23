# Monitorer

## Dev

1. Run `npm run dev`
2. Open http://localhost:3000 (not 127.0.0.1)

## Adding new source

1. Add `src/server/sources/<new-source>.ts`, make sure export is correct ISource
2. Use `fetchJson` or `fetchHtml` from utils for fetching data
3. Add `<new-source>` to `src/server/sources/sources.ts`

## Used libraries

- [heroicons](https://heroicons.com)