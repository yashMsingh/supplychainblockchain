import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaExchangeAlt, FaClipboardList } from "react-icons/fa";
import toast from "react-hot-toast";
import { getReadOnlyContract } from "../utils/contractHelper";
import { formatContractValue, formatTxHash } from "../utils/formatters";

function eventIcon(name) {
  if (name === "AssetCreated") return <FaPlusCircle color="#00b894" />;
  if (name === "AssetTransferred") return <FaExchangeAlt color="#74b9ff" />;
  return <FaClipboardList color="#a29bfe" />;
}

export default function Dashboard() {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [transferredEvents, setTransferredEvents] = useState([]);
  const [recordedEvents, setRecordedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const contract = await getReadOnlyContract();

      let created = [];
      let transferred = [];
      let recorded = [];

      try {
        created = await contract.queryFilter("AssetCreated");
      } catch {
        created = await contract.queryFilter(contract.filters.AssetCreated());
      }

      try {
        transferred = await contract.queryFilter("AssetTransferred");
      } catch {
        transferred = await contract.queryFilter(contract.filters.AssetTransferred());
      }

      try {
        recorded = await contract.queryFilter("EventRecorded");
      } catch {
        recorded = await contract.queryFilter(contract.filters.EventRecorded());
      }

      setCreatedEvents(created);
      setTransferredEvents(transferred);
      setRecordedEvents(recorded);
    } catch (error) {
      toast.error(error.message || "Failed to fetch dashboard events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const intervalId = setInterval(fetchEvents, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const recentActivity = useMemo(() => {
    const combined = [
      ...createdEvents.map((event) => ({ ...event, displayName: "AssetCreated" })),
      ...transferredEvents.map((event) => ({ ...event, displayName: "AssetTransferred" })),
      ...recordedEvents.map((event) => ({ ...event, displayName: "EventRecorded" }))
    ];

    return combined
      .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
      .slice(0, 10);
  }, [createdEvents, transferredEvents, recordedEvents]);

  const handleTrackProduct = () => {
    if (!productId.trim()) {
      toast.error("Enter a product ID");
      return;
    }
    navigate(`/history?id=${encodeURIComponent(productId.trim())}`);
  };

  return (
    <div className="container page-wrap">
      <div className="card" style={{ borderTop: "4px solid #2ecc71" }}>
        <h2>Live Dashboard</h2>
        <p className="muted">Auto-refreshes every 10 seconds from Hardhat localhost events.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "12px", marginTop: "16px" }}>
          {loading ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="card" style={{ padding: "18px", opacity: 0.55 }}>
                <div style={{ height: "16px", background: "#25345a", borderRadius: "6px", marginBottom: "10px" }} />
                <div style={{ height: "28px", background: "#25345a", borderRadius: "6px" }} />
              </div>
            ))
          ) : (
            <>
              <div className="card" style={{ padding: "18px" }}>
                <p className="muted">Total Products Created</p>
                <h3 style={{ marginTop: "6px", color: "#86ffd0" }}>{createdEvents.length}</h3>
              </div>
              <div className="card" style={{ padding: "18px" }}>
                <p className="muted">Total Transfers</p>
                <h3 style={{ marginTop: "6px", color: "#86ffd0" }}>{transferredEvents.length}</h3>
              </div>
              <div className="card" style={{ padding: "18px" }}>
                <p className="muted">Total Events Recorded</p>
                <h3 style={{ marginTop: "6px", color: "#86ffd0" }}>{recordedEvents.length}</h3>
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3 style={{ marginBottom: "10px" }}>Quick Search</h3>
          <div className="search-row">
            <input
              type="text"
              placeholder="Enter Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
            <button className="btn" style={{ background: "#2ecc71", color: "#05210f" }} onClick={handleTrackProduct}>
              Track Product
            </button>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <h3 style={{ marginBottom: "12px" }}>Recent Activity</h3>
          {loading ? (
            <div className="card" style={{ padding: "16px", opacity: 0.6 }}>Loading events...</div>
          ) : recentActivity.length === 0 ? (
            <div className="card" style={{ padding: "16px" }}>No events yet. Run transactions to populate activity.</div>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {recentActivity.map((evt, index) => (
                <div key={`${evt.transactionHash}-${index}`} className="card" style={{ padding: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    {eventIcon(evt.displayName)}
                    <strong>{evt.displayName}</strong>
                  </div>
                  <p className="muted">Product ID: {formatContractValue(evt.args?.productId) || "-"}</p>
                  <p className="muted">Block: {Number(evt.blockNumber)}</p>
                  <p className="muted">Tx: {formatTxHash(evt.transactionHash || "")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
