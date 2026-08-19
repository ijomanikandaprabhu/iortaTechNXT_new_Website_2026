import { PageHero } from "@/components/sections/PageHero";
import { Prose, Section, TagList, bandTone } from "@/components/sections/Section";
import { LeadForm, type LeadField } from "@/features/crm/components/LeadForm";
import type { Locale } from "@/core/i18n/config";
import { getLocalizedPath } from "@/core/i18n/routing";
import { getPageTranslations } from "./translator";

/**
 * Request Demo and Newsletter.
 *
 * Both are "hero, some framing, a form, then what happens next". The field
 * list comes from the message bundle so a form can gain a question without a
 * code change, and `source` lets the CRM tell the two apart.
 */

type Hero = { eyebrow: string; title: string; lede?: string };
type Block = { eyebrow?: string; title?: string; body?: string[]; tags?: string[] };
type FormConfig = {
  eyebrow?: string;
  title?: string;
  fields: LeadField[];
  submit: string;
  submitting: string;
  success: string;
  error: string;
  microcopy?: string;
};

export async function FormPage({
  locale,
  namespace,
  source,
  /** Preselects a value, e.g. the product the visitor arrived from. */
  preselect,
}: {
  locale: Locale;
  namespace: string;
  source: string;
  preselect?: { field: string; value: string };
}) {
  const t = await getPageTranslations(locale, namespace);

  const hero = t.raw("hero") as Hero;
  const before = (t.raw("before") ?? []) as Block[];
  const form = t.raw("form") as FormConfig;
  const after = (t.raw("after") ?? []) as Block[];

  const fields = form.fields.map((field) =>
    preselect && field.name === preselect.field
      ? { ...field, defaultValue: preselect.value }
      : field,
  );

  /**
   * The form band never inverts.
   *
   * A dark band behind a form needs its own input, label, placeholder and
   * validation-state styling, none of which exists yet, and an untested dark
   * treatment on the site's two conversion forms is not a risk worth taking
   * for cadence. It still consumes an index, so the rhythm resumes correctly
   * on the blocks after it rather than shifting the whole tail of the page.
   */
  const formBand = bandTone(before.length);
  const formTone = formBand === "dark" ? "muted" : formBand;

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} lede={hero.lede} title={hero.title} />

      {before.map((block, index) => (
        <Section
          eyebrow={block.eyebrow}
          key={block.eyebrow ?? block.title}
          title={block.title}
          tone={bandTone(index)}
        >
          {block.body ? <Prose paragraphs={block.body} /> : null}
          {block.tags ? <TagList items={block.tags} /> : null}
        </Section>
      ))}

      <Section eyebrow={form.eyebrow} title={form.title} tone={formTone}>
        <LeadForm
          fields={fields}
          labels={{
            submit: form.submit,
            submitting: form.submitting,
            success: form.success,
            error: form.error,
          }}
          locale={locale}
          source={source}
        />
        {form.microcopy && <p className="leadform__microcopy">{form.microcopy}</p>}
      </Section>

      {after.map((block, index) => (
        <Section
          eyebrow={block.eyebrow}
          key={block.eyebrow ?? block.title}
          title={block.title}
          tone={bandTone(before.length + 1 + index)}
        >
          {block.body ? <Prose paragraphs={block.body} /> : null}
          {block.tags ? <TagList items={block.tags} /> : null}
        </Section>
      ))}

      <span className="u-visually-hidden">
        <a href={getLocalizedPath("/", locale)}>Home</a>
      </span>
    </>
  );
}
