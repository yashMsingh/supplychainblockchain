import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import { WalletProvider } from "./context/WalletContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateAsset from "./pages/CreateAsset";
import TransferAsset from "./pages/TransferAsset";
import RecordEvent from "./pages/RecordEvent";
import ViewHistory from "./pages/ViewHistory";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ErrorBoundary>
      <WalletProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#16213e",
                color: "#ffffff",
                border: "1px solid #0f3460"
              }
            }}
          />

          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateAsset />} />
            <Route path="/transfer" element={<TransferAsset />} />
            <Route path="/record" element={<RecordEvent />} />
            <Route path="/history" element={<ViewHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </ErrorBoundary>
  );
}
