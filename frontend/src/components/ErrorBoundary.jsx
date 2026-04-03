import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught error:", error);
    console.error("ErrorBoundary error info:", info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0f0f23",
            padding: "20px"
          }}
        >
          <div
            style={{
              maxWidth: "680px",
              width: "100%",
              background: "#16213e",
              border: "1px solid #d63031",
              borderRadius: "14px",
              padding: "24px"
            }}
          >
            <h2 style={{ marginBottom: "12px" }}>Something went wrong</h2>
            <pre
              style={{
                background: "#0f0f23",
                border: "1px solid #2f3757",
                borderRadius: "8px",
                padding: "12px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "#ff9d9d",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                marginBottom: "16px"
              }}
            >
              {this.state.error?.message || "Unknown application error"}
            </pre>
            <button className="btn btn-danger" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
