# Makan Mana?

**Nak makan apa hari ni?** An open-source food picker that starts in Malaysia and covers the world: spin a wheel, type what you're craving in plain Malay or English, or open real shops nearby.

## Features

- **Spin wheel picker**: filter by meal time, budget, spicy and halal option, spin, and get a result card with reasons, save, "tak nak ni" and a Google Maps link. Avoids repeating your last 6 picks.
- **Smart search**: type `nasi pedas bawah RM15 dekat JB malam ni` and it understands budget, meal time, spicy, halal, cuisine, food type and location. Runs fully in the browser with keyword rules, so it never invents restaurants, prices or halal status.
- **Discover**: 236 dishes across 36 cuisines in 10 regions: Malaysia, Southeast Asia, East Asia, South Asia, Middle East, Europe, the Americas, Africa, Oceania and fast food. Filter by region, then by cuisine. Results load 24 at a time, and photos are only fetched when a card scrolls near the screen.
- **No dead ends**: if nothing matches exactly, the closest dishes are shown with the budget and spice limits relaxed.
- **Nearby**: uses your location (with permission) or an area name to open real Google Maps results, including quick links for fast-food chains (names only, no logos). No fake restaurant data.
- **Favourites**: saved in your browser, no account needed.
- Food photos: your own photos first (`public/food/`), then Wikipedia/Wikimedia Commons with credit, then an illustrated plate tile coloured by food type.
- Colour contrast checked against WCAG 2.1 AA (text 4.5:1 or better), including button labels and wheel slices.
- **Bilingual**: switch between Bahasa Malaysia and English anytime with the BM / EN toggle. The whole interface and all dish descriptions translate, the choice is remembered, and smart search understands both languages.
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
  constants/    language-neutral lists and price ranges
  data/         dishes.json, the open dataset
  hooks/        useDishImage
  i18n/         ms.ts (source) and en.ts dictionaries, useT() hook, language store
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
  "descriptionEn": "Coconut rice with sambal, anchovies, peanuts and egg. The king of breakfast.",
  "image": null,
  "wiki": "Nasi_lemak"
}
```

| Field | Allowed values |
|---|---|
| `category` | `rice`, `noodle`, `bread`, `meat`, `soup`, `salad`, `snack`, `dessert`, `drink` |
| `cuisine` | one of the 36 cuisines in `REGION_CUISINES` in `src/constants/labels.ts` (e.g. `malay`, `japanese`, `italian`, `fast-food`) |
| `mealTime` | one or more of `breakfast`, `lunch`, `teatime`, `dinner`, `supper` |
| `price` | `cheap` ($), `mid` ($$), `pricey` ($$$). A relative level, not an exact price |
| `halalOption` | `true` if a halal version is easy to find in Malaysia |
| `description` / `descriptionEn` | Malay and English, 10–120 characters each |
| `image` | Your own photo, e.g. `/food/nasi-lemak.webp`, or `null`. See `public/food/README.md` |
| `wiki` | English Wikipedia page title for the photo, or `null` |

`halalOption` describes the dish in general, not any specific shop. Always check the shop's halal certification.

## Deploy

Works on Vercel with no configuration: import the repo and deploy. `vercel.json` rewrites all routes to `index.html` so deep links like `/makanan/nasi-lemak` work.

## Roadmap

- Real AI search through a serverless function (keys stay on the server)
- More regional dishes from every state

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Adding a dish is a one-file change.

## License

MIT

## Translations

All interface text lives in `src/i18n/ms.ts` (the source) and `src/i18n/en.ts`. TypeScript checks that both dictionaries have exactly the same keys, so a missing translation fails the build. In components, read text with `const t = useT()` and use `t.section.key`.
