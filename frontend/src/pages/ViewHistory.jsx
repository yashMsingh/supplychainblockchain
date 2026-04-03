import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useContract } from "../hooks/useContract";
import EventBadge from "../components/EventBadge";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatTimestamp, shortenAddress, getEventColor } from "../utils/formatters";

export default function ViewHistory() {
  const { loading, queryContract } = useContract();
  const [searchParams] = useSearchParams();
  const [productId, setProductId] = useState("");
  const [history, setHistory] = useState([]);
  const [product, setProduct] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const performSearch = useCallback(async (id) => {
    if (!id?.trim()) {
      toast.error("Please enter Product ID");
      return;
    }

    try {
      setError("");
      setSearched(false);

      const cleanId = id.trim();
      const historyResult = await queryContract("queryHistory", [cleanId]);
      const productResult = await queryContract("getProduct", [cleanId]);

      setHistory(historyResult);
      setProduct(productResult);
      setSearched(true);
    } catch {
      setHistory([]);
      setProduct(null);
      setSearched(true);
      setError("Product not found");
      toast.error("Product not found");
    }
  }, [queryContract]);

  useEffect(() => {
    const idFromQuery = searchParams.get("id") || "";
    if (idFromQuery) {
      setProductId(idFromQuery);
      performSearch(idFromQuery);
    }
  }, [searchParams, performSearch]);

  return (
    <div className="container page-wrapper">
      <h1 className="page-title">Track Product History</h1>
      <p className="page-subtitle">Query immutable supply chain events and provenance trail.</p>

      <div className="card">
        <div className="search-row">
          <input
            className="form-input"
            type="text"
            placeholder="Enter Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => performSearch(productId)} disabled={loading}>
            Track Product
          </button>
          {productId ? (
            <button className="btn btn-secondary" onClick={() => setProductId("")}>
              ×
            </button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ marginTop: "18px" }}>
          <LoadingSpinner size="md" text="Fetching product history..." />
        </div>
      ) : null}

      {error ? <div className="error-box" style={{ marginTop: "14px" }}>{error}</div> : null}

      {searched && !error && product ? (
        <>
          <div style={{ marginTop: "18px" }}>
            <ProductCard product={product} />
          </div>

          {history.length > 0 ? (
            <div className="grid-4" style={{ marginTop: "16px" }}>
              <div className="stat-card">
                <div className="stat-number">{history.length}</div>
                <div className="stat-label">Total Events</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">First Seen</div>
                <div style={{ fontWeight: 700, marginTop: "8px", fontSize: "0.9rem" }}>
                  {formatTimestamp(history[0].timestamp)}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Latest Event</div>
                <div style={{ marginTop: "8px" }}>
                  <EventBadge eventType={history[history.length - 1].eventType} />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Current Owner</div>
                <div style={{ fontWeight: 700, marginTop: "8px", fontSize: "0.9rem" }}>
                  {shortenAddress(product.currentOwner)}
                </div>
              </div>
            </div>
          ) : null}

          <div style={{ marginTop: "22px" }}>
            <h3 style={{ marginBottom: "12px" }}>Timeline</h3>

            {history.length === 0 ? (
              <div className="card">No history found for this product</div>
            ) : (
              <div className="timeline">
                {history.map((event, index) => (
                  <div className="timeline-item fade-in-up" style={{ animationDelay: `${index * 0.07}s` }} key={`${event.timestamp}-${index}`}>
                    <div className="timeline-dot" style={{ background: getEventColor(event.eventType) }} />
                    <div className="timeline-card" style={{ borderLeftColor: getEventColor(event.eventType) }}>
                      <div className="timeline-step">Step {index + 1}</div>
                      <EventBadge eventType={event.eventType} />
                      <div className="timeline-detail"><span>📍</span><span>{event.location}</span></div>
                      <div className="timeline-detail"><span>👤</span><span>{shortenAddress(event.actor)}</span></div>
                      <div className="timeline-detail"><span>🕐</span><span>{formatTimestamp(event.timestamp)}</span></div>
                      {event.notes ? (
                        <div className="timeline-detail"><span>📝</span><span>{event.notes}</span></div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
