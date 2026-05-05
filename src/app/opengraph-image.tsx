import { ImageResponse } from "next/og";

export const alt = "Server Deploy Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "#000000",
          color: "#ffffff",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700 }}>Server Deploy Guide</div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#e5e5e5",
            maxWidth: 900,
          }}
        >
          Production-ready VPS deployment — manual or Docker
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 22,
            color: "#999999",
          }}
        >
          Black & white docs · বাংলা / EN
        </div>
      </div>
    ),
    { ...size },
  );
}
