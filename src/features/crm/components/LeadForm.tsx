"use client";

import { useState } from "react";
import type { Locale } from "@/core/i18n/config";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

export type LeadField = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  options?: { value: string; label: string }[];
  prompt?: string;
  defaultValue?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

/**
 * The demo, newsletter and enquiry forms.
 *
 * Same posting behaviour as ContactForm — it knows nothing about CRM providers
 * and lets the API route decide where the record lands — but the fields are
 * data, because the three forms differ only in what they ask for.
 *
 * `source` is submitted as a hidden value so the CRM can tell a newsletter
 * signup apart from a demo request, which otherwise look identical.
 */
export function LeadForm({
  locale,
  fields,
  source,
  labels,
}: {
  locale: Locale;
  fields: LeadField[];
  source: string;
  labels: { submit: string; submitting: string; success: string; error: string };
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/crm/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, source, locale }),
      });

      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="status status--success">
        {labels.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="stack leadform">
      {fields.map((field) => (
        <Field key={field.name} {...field} />
      ))}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? labels.submitting : labels.submit}
      </Button>

      {status === "error" && (
        <p role="alert" className="status status--error">
          {labels.error}
        </p>
      )}
    </form>
  );
}
