import { Link } from "react-router-dom";
import { FaBox, FaExchangeAlt, FaClipboardList, FaHistory } from "react-icons/fa";

const featureCards = [
  {
    icon: <FaBox color="#00b4d8" size={24} />,
    title: "Register Products",
    description:
      "Add new products to the blockchain with unique IDs, names, locations and metadata",
    link: "/create",
    buttonLabel: "Create Product"
  },
  {
    icon: <FaExchangeAlt color="#f4a261" size={24} />,
    title: "Transfer Assets",
    description:
      "Transfer product ownership between manufacturers, distributors and retailers",
    link: "/transfer",
    buttonLabel: "Transfer Product"
  },
  {
    icon: <FaClipboardList color="#7b2d8b" size={24} />,
    title: "Track Events",
    description:
      "Record quality checks, processing steps, inspections and custom events",
    link: "/record",
    buttonLabel: "Record Event"
  },
  {
    icon: <FaHistory color="#2ecc71" size={24} />,
    title: "Full Provenance",
    description:
      "Query complete product history from manufacture to retail with timestamps",
    link: "/history",
    buttonLabel: "View History"
  }
];

const techStats = [
  { title: "Ethereum", subtitle: "Blockchain Platform" },
  { title: "Solidity 0.8.20", subtitle: "Smart Contract" },
  { title: "Hardhat", subtitle: "Development Network" },
  { title: "100% On-Chain", subtitle: "Data Storage" }
];

export default function Home() {
  return (
    <div>
      <section
        style={{
          background: "linear-gradient(135deg, #10163a 0%, #1b1f4a 40%, #0f0f23 100%)",
          padding: "70px 0"
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.7rem)", marginBottom: "12px" }}>Blockchain Supply Chain</h1>
          <p style={{ color: "#9ed8ff", fontSize: "1.1rem", marginBottom: "28px" }}>
            Transparent • Immutable • Trustless
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <Link className="btn" style={{ background: "#00b4d8", color: "#02232b" }} to="/create">
              Get Started
            </Link>
            <Link className="btn" style={{ background: "#1f2a5a", color: "#d7e4ff", border: "1px solid #2c3c78" }} to="/history">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ marginTop: "22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "12px" }}>
          {techStats.map((item) => (
            <div key={item.title} className="card" style={{ textAlign: "center", padding: "16px" }}>
              <h3 style={{ marginBottom: "6px", color: "#86dbff" }}>{item.title}</h3>
              <p className="muted">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ marginTop: "26px" }}>
        <h2 style={{ marginBottom: "14px" }}>Core Features</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "14px" }}>
          {featureCards.map((feature) => (
            <div className="card" key={feature.title}>
              <div style={{ marginBottom: "10px" }}>{feature.icon}</div>
              <h3 style={{ marginBottom: "8px" }}>{feature.title}</h3>
              <p className="muted" style={{ marginBottom: "16px" }}>{feature.description}</p>
              <Link className="btn btn-primary" to={feature.link}>{feature.buttonLabel}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ marginTop: "28px", marginBottom: "28px" }}>
        <h2 style={{ marginBottom: "14px" }}>How It Works</h2>
        <div className="card" style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "36px",
              top: "42px",
              bottom: "42px",
              width: "2px",
              background: "#214a75"
            }}
          />

          {[
            {
              n: 1,
              title: "Connect Wallet",
              text: "MetaMask connects to local blockchain"
            },
            {
              n: 2,
              title: "Register Product",
              text: "Manufacturer creates asset on chain"
            },
            {
              n: 3,
              title: "Track Journey",
              text: "Every transfer and event recorded forever"
            }
          ].map((step) => (
            <div key={step.n} style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: step.n !== 3 ? "18px" : "0" }}>
              <div
                style={{
                  minWidth: "30px",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "#00b4d8",
                  color: "#01232d",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                  zIndex: 1
                }}
              >
                {step.n}
              </div>
              <div>
                <h4 style={{ marginBottom: "4px" }}>{step.title}</h4>
                <p className="muted">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #24345d", padding: "18px 0 30px" }}>
        <div className="container" style={{ color: "#a8b3cf", textAlign: "center" }}>
          <p style={{ marginBottom: "8px" }}>Built with Solidity + React + Hardhat</p>
          <p style={{ marginBottom: "6px" }}>
            Team: Yashkumar Singh, Aayush Gaikwad, Dheeraj Borse, Atharv Kale
          </p>
          <p>Blockchain Technology — VIIT Pune</p>
        </div>
      </footer>
    </div>
  );
}
