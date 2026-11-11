import { ImageResponse } from "next/og";

export const alt = "Naima Studio di Bellezza";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const lines: Record<string, string> = {
  it: "La bellezza è nei dettagli.",
  fr: "La beauté est dans les détails.",
  en: "Beauty is in the details.",
};

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const line = lines[locale] ?? lines.it;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#191817",
          color: "#F8F6F2",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#D8CEC4" }}>
          NAIMA STUDIO DI BELLEZZA
        </div>
        <div style={{ display: "flex", fontSize: 78, lineHeight: 0.95, fontStyle: "italic", maxWidth: 920 }}>
          {line}
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#B59A69" }}>Messina · Sicilia</div>
      </div>
    ),
    size,
  );
}
