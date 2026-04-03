import { useEffect } from "react"
import { Link } from "react-router-dom"
import { WebGLShader } from "../components/ui/WebGLShader"
import { LiquidButton } from "../components/ui/LiquidButton"

export default function Home() {
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes ping {
        75%, 100% { transform: scale(2); opacity: 0; }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", overflow: "hidden" }}>
      <WebGLShader />

      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
      }}>

        <div style={{
          border: "1px solid #27272a",
          padding: "8px",
          width: "100%",
          maxWidth: "768px",
        }}>
          <main style={{
            border: "1px solid #27272a",
            padding: "40px 24px",
            overflow: "hidden",
            position: "relative",
          }}>

            <h1 style={{
              marginBottom: "12px",
              color: "white",
              textAlign: "center",
              fontSize: "clamp(2rem, 8vw, 7rem)",
              fontWeight: "800",
              letterSpacing: "-0.05em",
              lineHeight: 1.1,
            }}>
              Supply Chain
            </h1>

            <p style={{
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              fontSize: "clamp(0.75rem, 2vw, 1.125rem)",
              padding: "0 24px",
              marginBottom: "24px",
            }}>
              Transparent • Immutable • Trustless blockchain tracking
              for every product in your supply chain.
            </p>

            <div style={{
              margin: "32px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}>
              <span style={{ position: "relative", display: "flex",
                height: "12px", width: "12px",
                alignItems: "center", justifyContent: "center" }}>
                <span style={{
                  position: "absolute",
                  display: "inline-flex",
                  height: "100%", width: "100%",
                  borderRadius: "9999px",
                  backgroundColor: "#22c55e",
                  opacity: 0.75,
                  animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite",
                }} />
                <span style={{
                  position: "relative",
                  display: "inline-flex",
                  height: "8px", width: "8px",
                  borderRadius: "9999px",
                  backgroundColor: "#22c55e",
                }} />
              </span>
              <p style={{ fontSize: "12px", color: "#22c55e", margin: 0 }}>
                Live on Blockchain Network
              </p>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}>
              <Link to="/create" style={{ textDecoration: "none" }}>
                <LiquidButton
                  style={{ color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
                  size="xl"
                >
                  Get Started
                </LiquidButton>
              </Link>

              <Link to="/history" style={{ textDecoration: "none" }}>
                <LiquidButton
                  style={{ color: "rgba(255,255,255,0.7)", 
                    border: "1px solid rgba(255,255,255,0.15)" }}
                  size="xl"
                >
                  View History
                </LiquidButton>
              </Link>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px",
              marginTop: "48px",
            }}>
              {[
                { icon: "📦", label: "Create Product", to: "/create" },
                { icon: "🔄", label: "Transfer Asset", to: "/transfer" },
                { icon: "📋", label: "Record Event",   to: "/record"   },
                { icon: "🔍", label: "View History",   to: "/history"  },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{ textDecoration: "none" }}
                >
                  <div style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    padding: "16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s",
                    background: "rgba(255,255,255,0.03)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)"
                  }}
                  >
                    <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>
                      {item.icon}
                    </div>
                    <div style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}>
                      {item.label}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </main>
        </div>

        <p style={{
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.75rem",
          marginTop: "24px",
          textAlign: "center",
        }}>
          Built with Solidity + React + Hardhat · VIIT Pune
        </p>

      </div>
    </div>
  )
}
