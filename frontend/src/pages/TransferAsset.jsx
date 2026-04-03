import { useState } from "react";
import { ethers } from "ethers";
import { useContract } from "../hooks/useContract";
import WalletGuard from "../components/WalletGuard";
import ConfirmModal from "../components/ConfirmModal";
import TransactionStatus from "../components/TransactionStatus";
import LoadingSpinner from "../components/LoadingSpinner";
import { shortenAddress } from "../utils/formatters";

export default function TransferAsset() {
  const { loading, executeTransaction, queryContract } = useContract();
  const [form, setForm] = useState({
    productId: "",
    newOwner: "",
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

  const validate = () => {
    const next = {};

    if (!form.productId.trim()) next.productId = "Product ID is required";
    if (!form.newOwner.trim()) {
      next.newOwner = "New owner address is required";
    } else if (!ethers.isAddress(form.newOwner.trim())) {
      next.newOwner = "Invalid Ethereum address";
    }
    if (!form.location.trim()) next.location = "Location is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setShowConfirm(true);
  };

  const confirmTransfer = async () => {
    setShowConfirm(false);
    try {
      setTxHash("");
      setTxStatus("pending");

      const receipt = await executeTransaction(
        "transferAsset",
        [form.productId.trim(), form.newOwner.trim(), form.location.trim(), form.notes.trim()],
        "Product transferred successfully!"
      );

      setTxHash(receipt?.hash || receipt?.transactionHash || "");
      setTxStatus("success");
      setForm({ productId: "", newOwner: "", location: "", notes: "" });
      setPreview(null);
      setPreviewMessage("");
      setErrors({});
    } catch {
      setTxStatus("error");
    }
  };

  return (
    <WalletGuard>
      <div className="container page-wrapper">
        <h1 className="page-title">Transfer Product Ownership</h1>
        <p className="page-subtitle">Move product custody between supply chain participants.</p>

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
                <div className="form-helper">Current Owner: {shortenAddress(preview.currentOwner)}</div>
              </div>
            ) : null}

            <div className="form-group">
              <label className="form-label">New Owner Address</label>
              <input
                className={`form-input ${errors.newOwner ? "error" : ethers.isAddress(form.newOwner || "") ? "success" : ""}`}
                value={form.newOwner}
                onChange={(e) => onChange("newOwner", e.target.value)}
                placeholder="0x..."
              />
              {ethers.isAddress(form.newOwner || "") ? (
                <span className="form-helper" style={{ color: "#00b894" }}>✓ Valid Ethereum address</span>
              ) : null}
              {errors.newOwner ? <span className="form-error">{errors.newOwner}</span> : null}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  className={`form-input ${errors.location ? "error" : ""}`}
                  value={form.location}
                  onChange={(e) => onChange("location", e.target.value)}
                  placeholder="Mumbai Port"
                />
                {errors.location ? <span className="form-error">{errors.location}</span> : null}
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <input
                  className="form-input"
                  value={form.notes}
                  onChange={(e) => onChange("notes", e.target.value)}
                  placeholder="Shipment details"
                />
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" color="#ffffff" /> : null}
              Transfer Product
            </button>
          </form>

          <TransactionStatus txHash={txHash} status={txStatus === "idle" ? "" : txStatus} message="" />
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Transfer"
        message={`Transfer ${form.productId} to ${shortenAddress(form.newOwner)}?`}
        onConfirm={confirmTransfer}
        onCancel={() => setShowConfirm(false)}
      />
    </WalletGuard>
  );
}
