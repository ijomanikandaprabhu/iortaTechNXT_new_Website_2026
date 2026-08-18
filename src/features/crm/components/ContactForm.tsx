"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/core/i18n/config";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Knows nothing about CRM providers — it posts to our own API route and the
 * gateway decides where the record lands.
 */
export function ContactForm({ locale }: { locale: Locale }) {
  const t = useTranslations("contact.form");
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
        body: JSON.stringify({ ...payload, locale }),
      });

      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="status status--success">
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="stack">
      <Field name="firstName" label={t("firstName")} required />
      <Field name="lastName" label={t("lastName")} required />
      <Field name="email" label={t("email")} type="email" required />
      <Field name="company" label={t("company")} />
      <Field name="message" label={t("message")} multiline />

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? t("submitting") : t("submit")}
      </Button>

      {status === "error" && (
        <p role="alert" className="status status--error">
          {t("error")}
        </p>
      )}
    </form>
  );
}
