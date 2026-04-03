import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container page-wrapper" style={{ display: "grid", placeItems: "center" }}>
      <div className="card" style={{ maxWidth: "540px", width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: "4rem", color: "#00b4d8", marginBottom: "8px" }}>404</h1>
        <h2 style={{ marginBottom: "8px" }}>Page Not Found</h2>
        <p className="page-subtitle" style={{ marginBottom: "20px" }}>
          The page you are looking for does not exist
        </p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
