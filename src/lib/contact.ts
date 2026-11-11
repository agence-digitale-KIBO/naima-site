import { isLocale, type Locale } from "@/i18n/locales";

export type ContactField = "name" | "email" | "message" | "consent" | "form";

export type ContactErrorCode =
  | "name"
  | "email"
  | "message"
  | "consent"
  | "fast"
  | "unconfigured"
  | "error";

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  consent: boolean;
  website: string;
  startedAt: number;
  locale: Locale;
};

export type ContactResult =
  | { status: "success" }
  | { status: "unconfigured" }
  | { status: "error" }
  | { status: "invalid"; fields: Partial<Record<ContactField, ContactErrorCode>> };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseContact(input: unknown, now = Date.now()): ContactResult | { status: "ready"; data: ContactPayload } {
  if (!input || typeof input !== "object") {
    return { status: "invalid", fields: { form: "error" } };
  }

  const raw = input as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  const website = typeof raw.website === "string" ? raw.website : "";
  const consent = raw.consent === true;
  const startedAt = typeof raw.startedAt === "number" ? raw.startedAt : 0;
  const locale = typeof raw.locale === "string" && isLocale(raw.locale) ? raw.locale : null;

  const fields: Partial<Record<ContactField, ContactErrorCode>> = {};
  if (name.length < 2 || name.length > 80) fields.name = "name";
  if (!emailPattern.test(email) || email.length > 120) fields.email = "email";
  if (message.length < 10 || message.length > 2000) fields.message = "message";
  if (!consent) fields.consent = "consent";
  if (!locale) fields.form = "error";

  if (Object.keys(fields).length > 0) {
    return { status: "invalid", fields };
  }

  if (website.trim().length > 0) {
    return { status: "success" };
  }

  if (!startedAt || now - startedAt < 1500) {
    return { status: "invalid", fields: { form: "fast" } };
  }

  return {
    status: "ready",
    data: {
      name,
      email,
      message,
      consent,
      website,
      startedAt,
      locale: locale as Locale,
    },
  };
}
