"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export function CalEmbed({ calLink }: { calLink: string }) {
  useEffect(() => {
    let alive = true;
    void (async () => {
      const cal = await getCalApi();
      if (!alive) return;
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
        styles: { branding: { brandColor: "#191817" } },
      });
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Cal
      calLink={calLink}
      config={{ layout: "month_view", theme: "light" }}
      style={{ width: "100%", height: "100%", minHeight: 680, overflow: "auto" }}
    />
  );
}
