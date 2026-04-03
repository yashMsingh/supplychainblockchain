import { useState } from "react";
import { useContract } from "../hooks/useContract";
import WalletGuard from "../components/WalletGuard";
import ConfirmModal from "../components/ConfirmModal";
import TransactionStatus from "../components/TransactionStatus";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CreateAsset() {
  const { loading, executeTransaction } = useContract();
  const [form, setForm] = useState({
    productId: "",
    name: "",
    location: "",
    notes: ""
  });
  const [errors, setErrors] = useState({});
  const [txHash, setTxHash] = useState("");
  const [txStatus, setTxStatus] = useState("idle");
  const [showConfirm, setShowConfirm] = useState(false);

  const onChange = (key, value) => {
    if (key === "notes" && value.length > 200) return;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const next = {};

    if (!form.productId.trim()) {
      next.productId = "Product ID is required";
    } else if (!/^[a-zA-Z0-9-]+$/.test(form.productId.trim())) {
      next.productId = "Only alphanumeric and hyphens are allowed";
    }

    if (!form.name.trim()) {
      next.name = "Product name is required";
    } else if (form.name.trim().length < 2) {
      next.name = "Product name must be at least 2 characters";
    }

    if (!form.location.trim()) {
      next.location = "Location is required";
    }

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

  const confirmSubmission = async () => {
    setShowConfirm(false);
    try {
      setTxHash("");
      setTxStatus("pending");

      const receipt = await executeTransaction(
        "createAsset",
        [form.productId.trim(), form.name.trim(), form.location.trim(), form.notes.trim()],
        "Product created successfully!"
      );

      setTxHash(receipt?.hash || receipt?.transactionHash || "");
      setTxStatus("success");
      setForm({ productId: "", name: "", location: "", notes: "" });
      setErrors({});
    } catch (error) {
      setTxStatus("error");
    }
  };

  return (
    <WalletGuard>
      <div className="container page-wrapper">
        <h1 className="page-title">Register Product</h1>
        <p className="page-subtitle">Create immutable product records directly on blockchain.</p>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Product ID</label>
                <input
                  className={`form-input ${errors.productId ? "error" : ""}`}
                  value={form.productId}
                  onChange={(e) => onChange("productId", e.target.value)}
                  placeholder="PRODUCT-001"
                />
                <span className="form-helper">Use format: PRODUCT-001</span>
                {errors.productId ? <span className="form-error">{errors.productId}</span> : null}
              </div>

              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  className={`form-input ${errors.name ? "error" : ""}`}
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  placeholder="iPhone 15 Pro"
                />
                {errors.name ? <span className="form-error">{errors.name}</span> : null}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                className={`form-input ${errors.location ? "error" : ""}`}
                value={form.location}
                onChange={(e) => onChange("location", e.target.value)}
                placeholder="Pune Factory"
              />
              {errors.location ? <span className="form-error">{errors.location}</span> : null}
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                value={form.notes}
                onChange={(e) => onChange("notes", e.target.value)}
                placeholder="Batch details"
              />
              <span className="form-helper">{form.notes.length}/200</span>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" color="#ffffff" /> : null}
              Register Product
            </button>
          </form>

          <TransactionStatus txHash={txHash} status={txStatus === "idle" ? "" : txStatus} message="" />
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Product Registration"
        message={`Register ${form.name} with ID ${form.productId} on blockchain?`}
        onConfirm={confirmSubmission}
        onCancel={() => setShowConfirm(false)}
      />
    </WalletGuard>
  );
}
