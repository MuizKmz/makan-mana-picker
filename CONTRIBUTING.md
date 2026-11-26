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
- Write the description in Malay, short and friendly (10–120 characters).
- Set `halalOption` to `true` only if a halal version is easy to find in Malaysia.
- Keep prices realistic for an average kedai, not a hotel.

## Code changes

- Logic lives in `src/lib/` as pure functions. If you change `picker.ts` or `smartSearch.ts`, add or update a test in `tests/`.
- Run `npm run build` before opening a PR; it type-checks everything.
- Never put API keys in frontend code or in `VITE_` environment variables.
