import { FaBox } from "react-icons/fa";
import { shortenAddress } from "../utils/formatters";

export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div
      style={{
        background: "#16213e",
        border: "1px solid #0f3460",
        borderRadius: "12px",
        padding: "20px",
        transition: "border-color 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#00b4d8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#0f3460";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: "#00d2ff", fontWeight: 700 }}>
          {product.productId}
        </span>
        <FaBox color="#00d2ff" />
      </div>

      <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>{product.name}</h3>
      <p style={{ color: "#a8b3cf", marginBottom: "10px" }}>Current Owner: {shortenAddress(product.currentOwner)}</p>

      <span
        style={{
          display: "inline-block",
          background: "#00b894",
          color: "white",
          borderRadius: "999px",
          padding: "4px 12px",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.6px"
        }}
      >
        {product.exists ? "ACTIVE" : "INACTIVE"}
      </span>
    </div>
  );
}
