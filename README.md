# Makan Mana?

**Nak makan apa hari ni?** An open-source Malaysian food picker: spin a wheel, type what you're craving in plain Malay or English, or open real shops nearby.

## Features

- **Spin wheel picker**: filter by meal time, budget, spicy and halal option, spin, and get a result card with reasons, save, "tak nak ni" and a Google Maps link. Avoids repeating your last 6 picks.
- **Smart search**: type `nasi pedas bawah RM15 dekat JB malam ni` and it understands budget, meal time, spicy, halal, cuisine, food type and location. Runs fully in the browser with keyword rules, so it never invents restaurants, prices or halal status.
- **Discover**: 64 dishes across Malay, Chinese, Indian, Mamak, Peranakan, Sabah and Sarawak, Western, Japanese, Korean and drinks.
- **Nearby**: uses your location (with permission) or an area name to open real Google Maps results. No fake restaurant data.
- **Favourites**: saved in your browser, no account needed.
- Real food photos from Wikipedia and Wikimedia Commons, with credit and an illustrated fallback.
- Mobile-first with a bottom tab bar, page transitions, and reduced-motion support.

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS v4, Motion, React Router, Zustand, Lucide icons and canvas-confetti. Tested with Vitest.

## Run it locally

```bash
npm install
npm run dev
```

Open the URL Vite prints, usually http://localhost:5173.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run unit tests (picker logic and smart search) |
| `npm run validate` | Check `src/data/dishes.json` for mistakes |

GitHub Actions runs validate, test and build on every push and pull request.

## Project structure

```
src/
  animations/   shared Motion variants
  components/   SpinWheel, DishCard, DishImage, SmartSearch, FilterPanel, Navbar...
  constants/    labels for meal times, prices, cuisines (Malay UI text)
  data/         dishes.json, the open dataset
  hooks/        useDishImage
  layouts/      RootLayout (nav, transitions), Page wrapper
  lib/          picker.ts (filter, pick, sample), smartSearch.ts (sentence parser), maps.ts
  pages/        Home, Picker, Discover, FoodDetail, Favourites, Nearby, About
  services/     foodService (data access), wikiImage (photo lookup + cache)
  store/        Zustand stores for favourites, recent picks and toasts
tests/          Vitest unit tests
```

Food-picking logic (`lib/picker.ts`) and search parsing (`lib/smartSearch.ts`) are pure functions with no React, so they're easy to test and reuse.

## Dataset

Each dish in `src/data/dishes.json`:

```json
{
  "id": "nasi-lemak",
  "name": "Nasi Lemak",
  "emoji": "🍛",
  "category": "rice",
  "cuisine": "malay",
  "mealTime": ["breakfast", "lunch", "supper"],
  "spicy": true,
  "halalOption": true,
  "price": "cheap",
  "description": "Nasi santan, sambal, ikan bilis, kacang dan telur. Raja segala sarapan.",
  "wiki": "Nasi_lemak"
}
```

| Field | Allowed values |
|---|---|
| `category` | `rice`, `noodle`, `bread`, `meat`, `soup`, `snack`, `dessert`, `drink` |
| `cuisine` | `malay`, `chinese`, `indian`, `mamak`, `peranakan`, `thai`, `east-malaysia`, `western`, `japanese`, `korean` |
| `mealTime` | one or more of `breakfast`, `lunch`, `teatime`, `dinner`, `supper` |
| `price` | `cheap` (RM4–10), `mid` (RM10–25), `pricey` (RM25+) |
| `halalOption` | `true` if a halal version is easy to find in Malaysia |
| `wiki` | English Wikipedia page title for the photo, or `null` |

`halalOption` describes the dish in general, not any specific shop. Always check the shop's halal certification.

## Deploy

Works on Vercel with no configuration: import the repo and deploy. `vercel.json` rewrites all routes to `index.html` so deep links like `/makanan/nasi-lemak` work.

## Roadmap

- Real AI search through a serverless function (keys stay on the server)
- Bahasa Malaysia / English language toggle
- More regional dishes from every state

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Adding a dish is a one-file change.

## License

MIT
