"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

/**
 * `href` is optional so the nav can show the shape of the site before every
 * page exists. An entry without one renders as plain, unfocusable text rather
 * than a link into a 404 — the same rule `site.config.ts` applies via `built`.
 */
export type PanelItem = { label: string; description: string; href?: string };
export type PanelGroup = { title: string; items: PanelItem[] };

export type NavItem = {
  label: string;
  href: string;
  /** Present = renders a full-width mega panel instead of a plain link. */
  groups?: PanelGroup[];
  featured?: { label: string; description: string; href: string };
};

type NavBarProps = {
  brandName: string;
  homeHref: string;
  items: NavItem[];
  labels: {
    signIn: string;
    seeDemo: string;
    getStarted: string;
    menu: string;
    close: string;
    back: string;
    announcement: string;
    announcementCta: string;
    dismiss: string;
    featuredTitle: string;
  };
  hrefs: { signIn: string; demo: string; cta: string; announcement: string };
};

/** Small square glyph used on each panel row. */
function PanelGlyph() {
  return (
    <span className="nav__glyph" aria-hidden="true">
      <svg viewBox="0 0 16 16">
        <rect x="2.5" y="2.5" width="11" height="11" rx="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5.5 8h5M8 5.5v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function NavBar({ brandName, homeHref, items, labels, hrefs }: NavBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [banner, setBanner] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Panels open on hover with a short close delay, so moving the pointer from
   * the trigger down into the panel does not dismiss it. Click and keyboard
   * both work too — hover alone would be unusable on touch and by keyboard.
   */
  function openNow(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }
  function closeSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /**
   * The bar is glass throughout; this only strengthens it once the page moves
   * off the opening frame, where the footage behind turns dark and busy and
   * the ink text needs more of a ground to sit on.
   */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Publishes the bar's real height as --nav-h so content below can clear it.
   * The height changes when the announcement is dismissed, so this is observed
   * rather than hard-coded.
   */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty("--nav-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    window.addEventListener("resize", publish);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", publish);
    };
  }, [banner]);

  const active = items.find((i) => i.label === openMenu && i.groups);

  return (
    <div
      className={`nav ${scrolled ? "nav--scrolled" : ""}`.trim()}
      ref={rootRef}
      onMouseLeave={closeSoon}
    >
      {banner && (
        <div className="nav__banner">
          <p className="nav__bannertext">
            {labels.announcement}{" "}
            <Link href={hrefs.announcement} className="nav__bannerlink">
              {labels.announcementCta}
            </Link>
          </p>
          <button
            type="button"
            className="nav__bannerclose"
            aria-label={labels.dismiss}
            onClick={() => setBanner(false)}
          >
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      <header className={`nav__bar ${openMenu ? "nav__bar--open" : ""}`.trim()}>
        <div className="nav__inner">
          <Link
            href={homeHref}
            className="nav__brand"
            aria-label={brandName}
            onClick={() => setMobileOpen(false)}
          >
            {/* 160px is the lockup's mandated minimum width — see brand.config. */}
            <Logo variant="full" size={160} alt="" />
          </Link>

          <nav className="nav__links" aria-label="Main">
            {items.map((item) =>
              item.groups ? (
                <button
                  key={item.label}
                  type="button"
                  className="nav__link nav__link--button"
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                  onMouseEnter={() => openNow(item.label)}
                  onFocus={() => openNow(item.label)}
                  onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                >
                  {item.label}
                  <svg className="nav__chevron" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="nav__link"
                  onMouseEnter={closeSoon}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="nav__actions">
            <Link href={hrefs.signIn} className="nav__signin">
              {labels.signIn}
            </Link>
            <Link href={hrefs.demo} className="btn btn--secondary btn--compact">
              {labels.seeDemo}
            </Link>
            <Link href={hrefs.cta} className="btn btn--primary btn--compact">
              {labels.getStarted}
            </Link>
          </div>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? labels.close : labels.menu}
            onClick={() => {
              setMobileOpen((v) => !v);
              setMobileSection(null);
            }}
          >
            <span className="nav__togglebar" />
            <span className="nav__togglebar" />
          </button>
        </div>

        {/* Full-width mega panel */}
        {active && (
          <div className="nav__mega" onMouseEnter={() => openNow(active.label)}>
            <div className="nav__megainner">
              <div className="nav__cols">
                {active.groups!.map((group) => (
                  <div key={group.title} className="nav__col">
                    <p className="nav__eyebrow">{group.title}</p>
                    {group.items.map((item) => {
                      const body = (
                        <>
                          <PanelGlyph />
                          <span className="nav__rowtext">
                            <span className="nav__rowlabel">{item.label}</span>
                            <span className="nav__rowdesc">{item.description}</span>
                          </span>
                        </>
                      );
                      return item.href ? (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="nav__row"
                          onClick={() => setOpenMenu(null)}
                        >
                          {body}
                        </Link>
                      ) : (
                        <span key={item.label} className="nav__row nav__row--pending">
                          {body}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>

              {active.featured && (
                <div className="nav__featured">
                  <p className="nav__eyebrow">{labels.featuredTitle}</p>
                  <Link
                    href={active.featured.href}
                    className="nav__featuredcard"
                    onClick={() => setOpenMenu(null)}
                  >
                    <span className="nav__featuredart" aria-hidden="true" />
                    <span className="nav__rowlabel">{active.featured.label}</span>
                    <span className="nav__rowdesc">{active.featured.description}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile: top level, then a drill-down per section */}
      {mobileOpen && (
        <div className="nav__mobile">
          {mobileSection === null ? (
            <>
              {items.map((item) => (
                <div key={item.label}>
                  {item.groups ? (
                    <button
                      type="button"
                      className="nav__mobilelink nav__mobilelink--button"
                      onClick={() => setMobileSection(item.label)}
                    >
                      {item.label}
                      <svg className="nav__chevron nav__chevron--right" viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M4.5 2.5 8 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="nav__mobilelink"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              <div className="nav__mobileactions">
                <Link href={hrefs.signIn} className="nav__signin" onClick={() => setMobileOpen(false)}>
                  {labels.signIn}
                </Link>
                <Link
                  href={hrefs.demo}
                  className="btn btn--secondary btn--compact"
                  onClick={() => setMobileOpen(false)}
                >
                  {labels.seeDemo}
                </Link>
                <Link
                  href={hrefs.cta}
                  className="btn btn--primary btn--compact"
                  onClick={() => setMobileOpen(false)}
                >
                  {labels.getStarted}
                </Link>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                className="nav__back"
                onClick={() => setMobileSection(null)}
              >
                <svg className="nav__chevron nav__chevron--left" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M7.5 2.5 4 6l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                {labels.back}
              </button>
              {items
                .find((i) => i.label === mobileSection)
                ?.groups?.map((group) => (
                  <div key={group.title} className="nav__mobilegroup">
                    <p className="nav__eyebrow">{group.title}</p>
                    {group.items.map((item) =>
                      item.href ? (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="nav__mobilesub"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span key={item.label} className="nav__mobilesub nav__row--pending">
                          {item.label}
                        </span>
                      ),
                    )}
                  </div>
                ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
