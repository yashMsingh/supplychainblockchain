import { useState } from "react";
import { useContract } from "../hooks/useContract";
import WalletGuard from "../components/WalletGuard";
import ConfirmModal from "../components/ConfirmModal";
import TransactionStatus from "../components/TransactionStatus";
import LoadingSpinner from "../components/LoadingSpinner";
import { EVENT_TYPES, getEventIcon, getEventLabel } from "../utils/formatters";

export default function RecordEvent() {
  const { loading, executeTransaction, queryContract } = useContract();
  const [form, setForm] = useState({
    productId: "",
    eventType: "quality_check",
    location: "",
    notes: ""
  });
  const [errors, setErrors] = useState({});
  const [txHash, setTxHash] = useState("");
  const [txStatus, setTxStatus] = useState("idle");
  const [showConfirm, setShowConfirm] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewMessage, setPreviewMessage] = useState("");

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.productId.trim()) next.productId = "Product ID is required";
    if (!form.location.trim()) next.location = "Location is required";
    if (!form.notes.trim()) next.notes = "Notes are required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const fetchPreview = async () => {
    if (!form.productId.trim()) {
      setPreview(null);
      setPreviewMessage("");
      return;
    }

    try {
      const product = await queryContract("getProduct", [form.productId.trim()]);
      setPreview(product);
      setPreviewMessage("");
    } catch {
      setPreview(null);
      setPreviewMessage("Product not found");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setShowConfirm(true);
  };

  const confirmRecord = async () => {
    setShowConfirm(false);
    try {
      setTxHash("");
      setTxStatus("pending");

      const receipt = await executeTransaction(
        "recordEvent",
        [form.productId.trim(), form.eventType, form.location.trim(), form.notes.trim()],
        "Event recorded successfully!"
      );

      setTxHash(receipt?.hash || receipt?.transactionHash || "");
      setTxStatus("success");
      setForm({ productId: "", eventType: "quality_check", location: "", notes: "" });
      setErrors({});
      setPreview(null);
      setPreviewMessage("");
    } catch {
      setTxStatus("error");
    }
  };

  return (
    <WalletGuard>
      <div className="container page-wrapper">
        <h1 className="page-title">Record Supply Chain Event</h1>
        <p className="page-subtitle">Log important milestone events for a product journey.</p>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product ID</label>
              <input
                className={`form-input ${errors.productId ? "error" : ""}`}
                value={form.productId}
                onChange={(e) => onChange("productId", e.target.value)}
                onBlur={fetchPreview}
                placeholder="IPHONE15-001"
              />
              {errors.productId ? <span className="form-error">{errors.productId}</span> : null}
              {previewMessage ? <span className="form-error">{previewMessage}</span> : null}
            </div>

            {preview ? (
              <div className="card" style={{ marginBottom: "16px", padding: "14px" }}>
                <div style={{ fontWeight: 700, marginBottom: "4px" }}>{preview.name}</div>
                <div className="form-helper">Current Location: {preview.currentLocation}</div>
              </div>
            ) : null}

            <div className="form-group">
              <label className="form-label">Event Type</label>
              <div className="event-type-grid">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    className={`event-type-card ${form.eventType === type.value ? "selected" : ""}`}
                    onClick={() => onChange("eventType", type.value)}
                  >
                    <span className="event-type-icon">{getEventIcon(type.value)}</span>
                    <span className="event-type-label">{getEventLabel(type.value)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  className={`form-input ${errors.location ? "error" : ""}`}
                  value={form.location}
                  onChange={(e) => onChange("location", e.target.value)}
                  placeholder="Warehouse B"
                />
                {errors.location ? <span className="form-error">{errors.location}</span> : null}
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <input
                  className={`form-input ${errors.notes ? "error" : ""}`}
                  value={form.notes}
                  onChange={(e) => onChange("notes", e.target.value)}
                  placeholder="Package inspected"
                />
                {errors.notes ? <span className="form-error">{errors.notes}</span> : null}
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" color="#ffffff" /> : null}
              Record Event
            </button>
          </form>

          <TransactionStatus txHash={txHash} status={txStatus === "idle" ? "" : txStatus} message="" />
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Event Recording"
        message={`Record ${getEventLabel(form.eventType)} event for ${form.productId}?`}
        onConfirm={confirmRecord}
        onCancel={() => setShowConfirm(false)}
      />
    </WalletGuard>
  );
}
