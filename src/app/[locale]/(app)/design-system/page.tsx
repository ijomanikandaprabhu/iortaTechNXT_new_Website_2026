import type { Metadata } from "next";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { Locale } from "@/core/i18n/config";
import { Logo } from "@/components/brand/Logo";
import { TokenValue } from "@/features/design-system/TokenValue";
import {
  COLOR_GROUPS,
  ELEVATION,
  RADIUS_SCALE,
  SPACE_SCALE,
  TYPE_SCALE,
} from "@/features/design-system/catalog";

/**
 * Living reference for the TECHNXT design system.
 *
 * Everything renders from the real tokens and the real component classes, so
 * this page cannot drift from the implementation — if a swatch looks wrong,
 * the token is wrong.
 *
 * Copy here is intentionally not localized: this is an internal reference for
 * the team building the site, not a customer-facing page. It sits under the
 * (app) group, which is noindex.
 */
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);

  return (
    <div className="ds">
      <header className="ds__head">
        <p className="u-label">Internal reference</p>
        <h1 className="ds__title">Design system</h1>
        <p className="ds__intro">
          Rendered from <code>tokens.css</code> and <code>components.css</code>. Values are read
          from the browser at runtime, so this page always reflects the real implementation.
        </p>
      </header>

      {/* ---- Colour ---- */}
      <section className="ds__section">
        <h2 className="ds__h2">Colour</h2>
        {COLOR_GROUPS.map((group) => (
          <div key={group.title} className="ds__group">
            <h3 className="ds__h3">{group.title}</h3>
            {group.description && <p className="ds__desc">{group.description}</p>}
            <div className="ds__swatches">
              {group.swatches.map((s) => (
                <div key={s.token} className="ds__swatch">
                  <span className="ds__chip" style={{ background: `var(${s.token})` }} />
                  <code className="ds__token">{s.token}</code>
                  <TokenValue token={s.token} />
                  {s.note && <p className="ds__note">{s.note}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ---- Typography ---- */}
      <section className="ds__section">
        <h2 className="ds__h2">Typography</h2>
        <p className="ds__desc">
          Two families only. Display carries headings and figures; body carries copy and UI.
          Anything showing prices or stats gets <code>tabular-nums</code>.
        </p>
        <div className="ds__rows">
          {TYPE_SCALE.map((t) => (
            <div key={t.token} className="ds__row">
              <p
                className="ds__specimen"
                style={{
                  fontSize: `var(${t.token})`,
                  fontFamily: t.family === "display" ? "var(--font-display)" : "var(--font-body)",
                  fontWeight: t.family === "display" ? 700 : 400,
                }}
              >
                Insurance, rebuilt
              </p>
              <div className="ds__meta">
                <code className="ds__token">{t.token}</code>
                <span className="ds__value u-tabular">{t.px}px</span>
                <span className="ds__note">{t.family}</span>
              </div>
            </div>
          ))}
          <div className="ds__row">
            <p className="ds__specimen u-tabular" style={{ fontSize: "var(--text-heading)" }}>
              1,284,905 · 0.825 · 12,480
            </p>
            <div className="ds__meta">
              <code className="ds__token">.u-tabular</code>
              <span className="ds__note">figures align in columns</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Spacing + radius ---- */}
      <section className="ds__section ds__section--split">
        <div>
          <h2 className="ds__h2">Spacing</h2>
          <p className="ds__desc">8px base scale.</p>
          <div className="ds__stack">
            {SPACE_SCALE.map((token) => (
              <div key={token} className="ds__spaceitem">
                <span className="ds__bar" style={{ width: `var(${token})` }} />
                <code className="ds__token">{token}</code>
                <TokenValue token={token} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="ds__h2">Radius</h2>
          <p className="ds__desc">Each step has one job.</p>
          <div className="ds__stack">
            {RADIUS_SCALE.map((r) => (
              <div key={r.token} className="ds__radiusitem">
                <span className="ds__radiusbox" style={{ borderRadius: `var(${r.token})` }} />
                <code className="ds__token">{r.token}</code>
                <TokenValue token={r.token} />
                <span className="ds__note">{r.use}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Buttons ---- */}
      <section className="ds__section">
        <h2 className="ds__h2">Buttons</h2>
        <p className="ds__desc">
          CTAs use <code>--ui-blue</code>, never green — so &ldquo;click here&rdquo; can never be
          confused with &ldquo;you made money&rdquo;. Every button takes a 3px focus ring at 2px
          offset; tab to one to see it.
        </p>
        <div className="ds__specimens">
          <button type="button" className="btn btn--primary">
            Primary
          </button>
          <button type="button" className="btn btn--secondary">
            Secondary
          </button>
          <button type="button" className="btn btn--accent">
            Icon / CTA accent
          </button>
          <button type="button" className="btn btn--primary" disabled>
            Disabled
          </button>
        </div>

        <h3 className="ds__h3">Compact (header style)</h3>
        <p className="ds__desc">Shared by the nav and the hero so the two cannot drift.</p>
        <div className="ds__specimens">
          <button type="button" className="btn btn--primary btn--compact">
            Get started
          </button>
          <button type="button" className="btn btn--secondary btn--compact">
            See a demo
          </button>
        </div>
      </section>

      {/* ---- Cards ---- */}
      <section className="ds__section">
        <h2 className="ds__h2">Cards</h2>
        <p className="ds__desc">Three families. Dark cards rotate one accent — never both.</p>
        <div className="ds__cards">
          <article className="card card--white">
            <p className="card__label">White</p>
            <h3 className="card__title">Default data card</h3>
            <p className="card__body">1px line border and a soft neutral shadow.</p>
          </article>

          <article className="card card--glass">
            <p className="card__label">Glass</p>
            <h3 className="card__title">Payment method</h3>
            <p className="card__body">Blue-tinted translucent body over imagery.</p>
          </article>

          <article className="card card--dark" style={{ ["--card-accent" as string]: "var(--brand-green)" }}>
            <p className="card__label">Dark · green accent</p>
            <p className="card__stat u-tabular">+18.4%</p>
            <p className="card__body">Green reads as positive financial movement.</p>
          </article>

          <article className="card card--dark" style={{ ["--card-accent" as string]: "var(--brand-teal)" }}>
            <p className="card__label">Dark · teal accent</p>
            <p className="card__stat u-tabular">3,912</p>
            <p className="card__body">Teal is the informational alternative.</p>
          </article>
        </div>
      </section>

      {/* ---- Status ---- */}
      <section className="ds__section">
        <h2 className="ds__h2">Status</h2>
        <div className="ds__stack">
          <p className="status status--error">Something went wrong. Please try again.</p>
          <p className="status status--warning">This policy expires in 7 days.</p>
          <p className="status status--success">Payment received.</p>
        </div>
      </section>

      {/* ---- Logo ---- */}
      <section className="ds__section">
        <h2 className="ds__h2">Logo</h2>
        <p className="ds__desc">
          Minimum sizes are enforced in code, not just documented — the component warns in
          development if a consumer asks for smaller.
        </p>
        <div className="ds__logos">
          <div className="ds__logoitem">
            <Logo variant="full" size={200} />
            <code className="ds__token">full</code>
            <span className="ds__note">min width 160px</span>
          </div>
          <div className="ds__logoitem">
            <Logo variant="icon" size={64} alt="" />
            <code className="ds__token">icon</code>
            <span className="ds__note">min 32px · square contexts only</span>
          </div>
          <div className="ds__logoitem ds__logoitem--dark">
            <Logo variant="shield-filled" size={64} alt="" />
            <code className="ds__token">shield-filled</code>
            <span className="ds__note">min 48px · dark / photo</span>
          </div>
          <div className="ds__logoitem">
            <Logo variant="shield-outline" size={64} alt="" />
            <code className="ds__token">shield-outline</code>
            <span className="ds__note">min 48px · light backgrounds</span>
          </div>
        </div>
      </section>

      {/* ---- Elevation ---- */}
      <section className="ds__section">
        <h2 className="ds__h2">Elevation</h2>
        <div className="ds__shadows">
          {ELEVATION.map((token) => (
            <div key={token} className="ds__shadowitem">
              <span className="ds__shadowbox" style={{ boxShadow: `var(${token})` }} />
              <code className="ds__token">{token}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
