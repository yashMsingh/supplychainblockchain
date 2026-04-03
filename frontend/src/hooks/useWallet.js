import { useState, useEffect, useCallback } from "react";
import { connectWallet, getProvider } from "../utils/contractHelper";
import toast from "react-hot-toast";

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);

  const checkConnection = useCallback(async () => {
    if (!window.ethereum) {
      return;
    }

    try {
      const provider = await getProvider();
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      } else {
        setAddress(null);
        setIsConnected(false);
      }

      const chainHex = await provider.send("eth_chainId", []);
      setChainId(parseInt(chainHex, 16));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const addr = await connectWallet();
      setAddress(addr);
      setIsConnected(true);

      const provider = await getProvider();
      const chainHex = await provider.send("eth_chainId", []);
      setChainId(parseInt(chainHex, 16));

      toast.success("Wallet connected!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setChainId(null);
    toast.success("Wallet disconnected");
  }, []);

  const checkNetwork = useCallback(() => {
    if (chainId !== 31337) {
      toast.error("Please switch to Hardhat Local Network (Chain ID: 31337)");
      return false;
    }
    return true;
  }, [chainId]);

  useEffect(() => {
    checkConnection();

    if (!window.ethereum) return;

    let injected = window.ethereum;
    if (Array.isArray(window.ethereum.providers) && window.ethereum.providers.length > 0) {
      injected = window.ethereum.providers.find((provider) => provider?.isMetaMask) || window.ethereum.providers[0];
    }

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      } else {
        disconnect();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    injected.on?.("accountsChanged", handleAccountsChanged);
    injected.on?.("chainChanged", handleChainChanged);

    return () => {
      injected.removeListener?.("accountsChanged", handleAccountsChanged);
      injected.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [checkConnection, disconnect]);

  return {
    address,
    isConnected,
    isConnecting,
    chainId,
    error,
    connect,
    disconnect,
    checkConnection,
    checkNetwork
  };
}
