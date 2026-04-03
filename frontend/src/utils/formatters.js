export function shortenAddress(address) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export function formatTimestamp(timestamp) {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

export function formatTxHash(hash) {
  if (!hash) return "";
  return hash.slice(0, 10) + "..." + hash.slice(-8);
}

export function formatContractValue(value) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map((item) => formatContractValue(item)).join(", ");
  }
  if (typeof value === "object") {
    if (typeof value.hash === "string") {
      return value.hash;
    }
    if (typeof value.toString === "function" && value.toString !== Object.prototype.toString) {
      const formatted = value.toString();
      if (formatted !== "[object Object]") {
        return formatted;
      }
    }
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

export const EVENT_TYPES = [
  { value: "quality_check", label: "Quality Check", icon: "QC" },
  { value: "processing", label: "Processing", icon: "PR" },
  { value: "inspection", label: "Inspection", icon: "IN" },
  { value: "packaging", label: "Packaging", icon: "PK" },
  { value: "dispatch", label: "Dispatch", icon: "DS" },
  { value: "received", label: "Received", icon: "RC" }
];

export function getEventLabel(eventType) {
  const item = EVENT_TYPES.find((evt) => evt.value === eventType);
  return item ? item.label : "Unknown";
}

export function getEventIcon(eventType) {
  const item = EVENT_TYPES.find((evt) => evt.value === eventType);
  return item ? item.icon : "--";
}

export function getEventColor(eventType) {
  const map = {
    created: "#00b894",
    transferred: "#0984e3",
    quality_check: "#fdcb6e",
    processing: "#6c5ce7",
    inspection: "#e17055",
    packaging: "#fd79a8",
    dispatch: "#00cec9",
    received: "#55efc4"
  };

  return map[(eventType || "").toLowerCase()] || "#636e72";
}

export function formatEthAddress(address) {
  return address;
}

export function timeAgo(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  const diff = Math.max(0, now - Number(timestamp));

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}
