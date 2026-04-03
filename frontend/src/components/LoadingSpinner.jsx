import { useMemo } from "react";

const SIZE_MAP = {
  sm: 20,
  md: 40,
  lg: 60
};

export default function LoadingSpinner({ size = "md", color = "#00b4d8", text = "" }) {
  const pixelSize = SIZE_MAP[size] || SIZE_MAP.md;

  const spinnerStyle = useMemo(
    () => ({
      width: `${pixelSize}px`,
      height: `${pixelSize}px`,
      borderRadius: "50%",
      border: `${Math.max(2, Math.floor(pixelSize / 8))}px solid rgba(255,255,255,0.22)`,
      borderTopColor: color,
      animation: "spin 0.9s linear infinite"
    }),
    [pixelSize, color]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      <div style={spinnerStyle} />
      {text ? <span style={{ color: "#b8c1da", fontSize: "0.9rem" }}>{text}</span> : null}
    </div>
  );
}
