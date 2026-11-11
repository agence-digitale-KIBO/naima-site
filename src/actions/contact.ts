"use server";

import { parseContact, type ContactResult } from "@/lib/contact";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, number[]>();

function limited(email: string, now: number): boolean {
  const recent = (attempts.get(email) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(email, recent);
    return true;
  }
  recent.push(now);
  attempts.set(email, recent);
  return false;
}

export async function sendContact(input: unknown): Promise<ContactResult> {
  const parsed = parseContact(input);
  if (parsed.status !== "ready") return parsed;

  if (limited(parsed.data.email.toLowerCase(), Date.now())) {
    return { status: "invalid", fields: { form: "fast" } };
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!webhook) return { status: "unconfigured" };

  try {
    const headers: HeadersInit = { "content-type": "application/json" };
    const token = process.env.CONTACT_WEBHOOK_TOKEN?.trim();
    if (token) headers.authorization = `Bearer ${token}`;

    const response = await fetch(webhook, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        locale: parsed.data.locale,
        site: "naima-studio",
      }),
    });

    if (!response.ok) return { status: "error" };
    return { status: "success" };
  } catch {
    return { status: "error" };
  }
}
