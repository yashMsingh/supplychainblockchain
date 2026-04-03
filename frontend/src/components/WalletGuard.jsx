import { useWalletContext } from "../context/WalletContext";

export default function WalletGuard({ children }) {
  const { isConnected, isConnecting, connect } = useWalletContext();

  if (!isConnected) {
    return (
      <div className="container page-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card" style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🔐</div>
          <h2 style={{ marginBottom: "8px" }}>Wallet Required</h2>
          <p className="page-subtitle" style={{ marginBottom: "18px" }}>
            Connect your MetaMask wallet to use this feature
          </p>
          <button className="btn btn-primary" onClick={connect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      </div>
    );
  }

  return children;
}
