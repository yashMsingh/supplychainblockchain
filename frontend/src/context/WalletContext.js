import { createContext, useContext } from "react";
import { useWallet } from "../hooks/useWallet";

const WalletContext = createContext(null);

function WalletProvider({ children }) {
  const wallet = useWallet();

  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>;
}

function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within WalletProvider");
  }
  return context;
}

export { WalletProvider, useWalletContext };
