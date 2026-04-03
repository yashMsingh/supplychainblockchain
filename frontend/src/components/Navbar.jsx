import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { useWalletContext } from "../context/WalletContext";
import { shortenAddress } from "../utils/formatters";
import { addHardhatNetwork } from "../utils/contractHelper";
import toast from "react-hot-toast";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [addingNetwork, setAddingNetwork] = useState(false);
  const { address, isConnected, isConnecting, chainId, connect, disconnect } = useWalletContext();

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/create", label: "Create" },
    { to: "/transfer", label: "Transfer" },
    { to: "/record", label: "Record" },
    { to: "/history", label: "History" }
  ];

  const handleAddNetwork = async () => {
    setAddingNetwork(true);
    try {
      await addHardhatNetwork();
      toast.success("Hardhat network added! Switching now...");
    } catch (error) {
      toast.error(error.message || "Failed to add network");
    } finally {
      setAddingNetwork(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-content">
          <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
            ⛓ SupplyChain
          </Link>

          <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {!isConnected ? (
              <button className="btn btn-primary btn-sm" onClick={connect} disabled={isConnecting}>
                {isConnecting ? <LoadingSpinner size="sm" color="#ffffff" /> : "Connect Wallet"}
              </button>
            ) : (
              <>
                <span className="wallet-pill">{shortenAddress(address)}</span>
                <button className="btn btn-secondary btn-sm" onClick={disconnect}>
                  Disconnect
                </button>
              </>
            )}

            <button className="btn btn-secondary btn-sm mobile-menu-toggle" onClick={() => setMenuOpen((prev) => !prev)}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {isConnected && chainId !== 31337 ? (
        <div
          className="network-warning"
          onClick={handleAddNetwork}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          ⚠ Wrong Network — Click to add Hardhat Local (Chain ID: 31337)
          {addingNetwork && <LoadingSpinner size="sm" color="#ffff00" style={{ display: "inline-block", marginLeft: "8px" }} />}
        </div>
      ) : null}
    </>
  );
}
