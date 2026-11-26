import { motion } from "motion/react";
import { Page } from "../layouts/Page";
import { foodService } from "../services/foodService";
import { stagger } from "../animations/variants";
import { DishCard } from "../components/DishCard";
import { ResultCard } from "../components/ResultCard";
import { DishCardFeature } from "../components/cards/DishCardFeature";
import { DishCardCompact } from "../components/cards/DishCardCompact";
import { ResultCardGlow } from "../components/cards/ResultCardGlow";

/**
 * TEMPORARY: compares the current cards with the new variants (route /kad).
 * Delete this page and its route once a design is chosen.
 */

const noop = () => {};
const reasons = ["Sesuai untuk makan tengah hari", "Bawah RM15", "Ada pilihan halal"];

function Section({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-extrabold">{title}</h2>
      <p className="mt-1 text-muted">{note}</p>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-orange-ink">{children}</p>;
}

export default function CardPreviewPage() {
  const all = foodService.all();
  const withPhoto = all.filter((d) => d.image || d.wiki);
  // Mix spicy and non-spicy dishes so the badge shows up in the grid.
  const grid = [...withPhoto.filter((d) => d.spicy).slice(0, 2), ...withPhoto.filter((d) => !d.spicy).slice(0, 2)];
  const plateOnly = all.find((d) => !d.image && !d.wiki);
  const list = withPhoto.slice(4, 9);
  const winner = grid[0] ?? all[0];

  return (
    <Page title="Pratonton kad · Card preview">
      <div className="container-page pb-20 pt-8 md:pt-12">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Card preview</h1>
        <p className="mt-2 max-w-2xl text-muted">
          The current cards next to the three new variants, using real dishes. Hover the new dish cards with a mouse to see the spotlight.
        </p>

        <Section title="1 · Dish card" note="Used on Home, Discover, Favourites and dish details.">
          <Label>Current</Label>
          <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {grid.map((d) => (
              <DishCard key={d.id} dish={d} />
            ))}
          </motion.div>
          <Label>New: photo overlay + spotlight</Label>
          <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {grid.map((d) => (
              <DishCardFeature key={d.id} dish={d} />
            ))}
          </motion.div>
          {plateOnly && (
            <>
              <Label>New, dish without a photo (plate tile)</Label>
              <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <DishCardFeature dish={plateOnly} />
              </motion.div>
            </>
          )}
        </Section>

        <Section title="2 · Spin result card" note="Shown on the spin wheel page after a spin.">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <Label>Current</Label>
              <ResultCard dish={winner} reasons={reasons} onAgain={noop} onExclude={noop} />
            </div>
            <div>
              <Label>New: turning glow frame</Label>
              <ResultCardGlow dish={winner} reasons={reasons} onAgain={noop} onExclude={noop} />
            </div>
          </div>
        </Section>

        <Section title="3 · Compact card" note="New: for the Favourites page and short lists, where a big grid is too much.">
          <Label>New: compact row</Label>
          <motion.div variants={stagger} initial="initial" animate="animate" className="grid max-w-2xl gap-3">
            {list.map((d) => (
              <DishCardCompact key={d.id} dish={d} />
            ))}
          </motion.div>
        </Section>
      </div>
    </Page>
  );
}
