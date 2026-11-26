# Dish photos

Put your own dish photos here, then point the dish at it in `src/data/dishes.json`:

```json
"image": "/food/nasi-lemak.webp"
```

- Name the file after the dish `id` (e.g. `nasi-lemak.webp`).
- Use a **4:3 landscape** photo, about **1200 × 900 px**. Cards crop to 4:3, and the hero and result card crop from the centre, so keep the food centred.
- WebP at quality 80 keeps each photo around 100–200 KB. Convert with `npx @squoosh/cli --webp '{"quality":80}' photo.jpg` or any image editor.
- Only use photos you took yourself or have the rights to.

A dish with `"image": null` falls back to its Wikipedia photo, and then to an illustrated plate tile.
