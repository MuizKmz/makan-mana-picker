import { Link } from "react-router";
import { GitPullRequest, MessageSquare } from "lucide-react";
import { Page } from "../layouts/Page";
import { foodService } from "../services/foodService";
import { useT } from "../i18n";

const REPO = "https://github.com/MuizKmz/makan-mana-picker";

export default function AboutPage() {
  const t = useT();
  const count = foodService.all().length;
  return (
    <Page title={t.about.title}>
      <section className="container-page max-w-3xl pt-8 md:pt-12">
        <h1 className="text-4xl font-extrabold sm:text-5xl">{t.about.headline}</h1>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/85">
          <p>{t.about.p1(count)}</p>
          <p>{t.about.p2}</p>
          <p>{t.about.p3}</p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <a href={REPO} target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-card border border-line bg-white p-5 hover:border-[#e2d3c0]">
            <GitPullRequest size={24} className="mt-0.5 shrink-0" />
            <span>
              <span className="block font-extrabold">{t.about.addTitle}</span>
              <span className="block text-sm text-muted">{t.about.addBody}</span>
            </span>
          </a>
          <a href={`${REPO}/issues/new`} target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-card border border-line bg-white p-5 hover:border-[#e2d3c0]">
            <MessageSquare size={24} className="mt-0.5 shrink-0" />
            <span>
              <span className="block font-extrabold">{t.about.fbTitle}</span>
              <span className="block text-sm text-muted">{t.about.fbBody}</span>
            </span>
          </a>
        </div>

        <Link to="/putar" className="btn-primary mt-10">
          {t.about.cta}
        </Link>
      </section>
    </Page>
  );
}
