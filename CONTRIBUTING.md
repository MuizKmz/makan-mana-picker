# Contributing

Terima kasih! The easiest way to help is to add a dish.

## Add a dish

1. Fork the repo and create a branch, e.g. `add-nasi-tomato`.
2. Add your dish to the end of `src/data/dishes.json`, following the format in the README.
3. For `wiki`, find the dish on English Wikipedia and copy the page title from the URL (e.g. `https://en.wikipedia.org/wiki/Nasi_lemak` gives `Nasi_lemak`). Use `null` if there's no page with a good photo.
4. Run the checks:
   ```bash
   npm run validate
   npm test
   ```
5. Open a pull request. Mention which state or region the dish is from if it's a local speciality.

## Guidelines

- One dish per entry. Variants (roti telur, roti bawang) belong in the main dish's description.
- Write `description` in Malay and `descriptionEn` in English, short and friendly (10–120 characters each).
- Set `halalOption` to `true` only if a halal version is easy to find in Malaysia.
- `price` is relative: `cheap` for street food and stalls, `mid` for casual restaurants, `pricey` for sit-down or special-occasion food.
- `cuisine` must be one of the cuisines in `REGION_CUISINES` (`src/constants/labels.ts`). Adding a new cuisine means adding it there, to `scripts/validate.mjs`, and a label in both `src/i18n/ms.ts` and `src/i18n/en.ts`.

## Code changes

- Never hardcode interface text in components. Add the key to both `src/i18n/ms.ts` and `src/i18n/en.ts`, then use `useT()`.
- Logic lives in `src/lib/` as pure functions. If you change `picker.ts` or `smartSearch.ts`, add or update a test in `tests/`.
- Run `npm run build` before opening a PR; it type-checks everything.
- Never put API keys in frontend code or in `VITE_` environment variables.
