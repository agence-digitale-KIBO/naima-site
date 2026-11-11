"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { sendContact } from "@/actions/contact";
import type { ContactField } from "@/lib/contact";
import type { Locale } from "@/i18n/locales";

const initial = { name: "", email: "", message: "", consent: false, website: "" };

export function ContactForm() {
  const t = useTranslations("form");
  const locale = useLocale() as Locale;
  const [fields, setFields] = useState(initial);
  const startedAt = useRef(0);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [status, setStatus] = useState<"idle" | "success" | "unconfigured" | "error">("idle");
  const [pending, startTransition] = useTransition();

  function messageFor(code: string | undefined) {
    if (code === "name") return t("nameError");
    if (code === "email") return t("emailError");
    if (code === "message") return t("messageError");
    if (code === "consent") return t("consentError");
    if (code === "fast") return t("fast");
    return t("error");
  }

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  return (
    <form
      className="grid gap-5"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setErrors({});
        setStatus("idle");
        startTransition(async () => {
          const result = await sendContact({
            ...fields,
            startedAt: startedAt.current,
            locale,
          });
          if (result.status === "success") {
            setFields(initial);
            setStatus("success");
            return;
          }
          if (result.status === "invalid") {
            const next: Partial<Record<ContactField, string>> = {};
            for (const [field, code] of Object.entries(result.fields)) {
              next[field as ContactField] = messageFor(code);
            }
            setErrors(next);
            return;
          }
          setStatus(result.status);
        });
      }}
    >
      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={fields.website}
            onChange={(event) => setFields((current) => ({ ...current, website: event.target.value }))}
          />
        </label>
      </div>

      <Field label={t("name")} error={errors.name} name="name">
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          required
          value={fields.name}
          onChange={(event) => setFields((current) => ({ ...current, name: event.target.value }))}
          className="min-h-12 w-full border-b border-sand bg-transparent py-2 outline-none"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
      </Field>
      <Field label={t("email")} error={errors.email} name="email">
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={fields.email}
          onChange={(event) => setFields((current) => ({ ...current, email: event.target.value }))}
          className="min-h-12 w-full border-b border-sand bg-transparent py-2 outline-none"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
      </Field>
      <Field label={t("message")} error={errors.message} name="message">
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={fields.message}
          onChange={(event) => setFields((current) => ({ ...current, message: event.target.value }))}
          className="w-full border-b border-sand bg-transparent py-2 outline-none"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
      </Field>
      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            className="mt-1 size-4"
            checked={fields.consent}
            onChange={(event) => setFields((current) => ({ ...current, consent: event.target.checked }))}
            aria-invalid={Boolean(errors.consent)}
          />
          <span>
            {t("consent")}{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy
            </Link>
          </span>
        </label>
        {errors.consent ? (
          <p id="contact-consent-error" className="mt-2 text-sm" role="alert">
            {errors.consent}
          </p>
        ) : null}
      </div>
      {errors.form ? (
        <p role="alert" className="text-sm">
          {errors.form}
        </p>
      ) : null}
      {status === "success" ? <p role="status">{t("success")}</p> : null}
      {status === "unconfigured" ? <p role="status">{t("unconfigured")}</p> : null}
      {status === "error" ? <p role="alert">{t("error")}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-fit items-center bg-ink px-5 text-[0.72rem] tracking-[0.16em] text-ivory uppercase disabled:opacity-60"
      >
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`contact-${name}`} className="eyebrow text-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`contact-${name}-error`} className="mt-2 text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
