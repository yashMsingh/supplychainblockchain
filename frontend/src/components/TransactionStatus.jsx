import { formatContractValue } from "../utils/formatters";

export default function TransactionStatus({ txHash, status, message }) {
  if (!status) return null;

  const safeTxHash = formatContractValue(txHash);
  const safeMessage = formatContractValue(message);

  const styleMap = {
    pending: {
      background: "#f6c90e",
      color: "#1f1600",
      icon: <span className="spinner" style={{ borderTopColor: "#1f1600" }} />, 
      text: "Transaction pending..."
    },
    success: {
      background: "#00b894",
      color: "#ffffff",
      icon: <span style={{ fontWeight: 900, fontSize: "18px" }}>✓</span>,
      text: "Transaction confirmed!"
    },
    error: {
      background: "#d63031",
      color: "#ffffff",
      icon: <span style={{ fontWeight: 900, fontSize: "20px" }}>✕</span>,
      text: safeMessage || "Transaction failed"
    }
  };

  const cfg = styleMap[status];
  if (!cfg) return null;

  return (
    <div
      style={{
        marginTop: "14px",
        background: cfg.background,
        color: cfg.color,
        borderRadius: "10px",
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        animation: "fadeIn 0.25s ease"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
        {cfg.icon}
        <span>{cfg.text}</span>
      </div>
      {status === "success" && safeTxHash ? <span style={{ fontSize: "12px", wordBreak: "break-all" }}>{safeTxHash}</span> : null}
      {status === "error" && safeMessage ? <span style={{ fontSize: "12px" }}>{safeMessage}</span> : null}
    </div>
  );
}
