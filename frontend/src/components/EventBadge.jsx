export default function EventBadge({ eventType }) {
  const normalized = (eventType || "").toLowerCase();

  const colorMap = {
    created: { background: "#00b894", color: "#ffffff" },
    transferred: { background: "#0984e3", color: "#ffffff" },
    quality_check: { background: "#fdcb6e", color: "#000000" },
    processing: { background: "#6c5ce7", color: "#ffffff" },
    inspection: { background: "#e17055", color: "#ffffff" },
    packaging: { background: "#fd79a8", color: "#ffffff" },
    dispatch: { background: "#00cec9", color: "#ffffff" },
    received: { background: "#55efc4", color: "#000000" },
    default: { background: "#636e72", color: "#ffffff" }
  };

  const style = colorMap[normalized] || colorMap.default;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        background: style.background,
        color: style.color
      }}
    >
      {normalized || "unknown"}
    </span>
  );
}
