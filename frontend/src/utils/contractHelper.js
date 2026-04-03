import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contractConfig";

function getInjectedProvider() {
  if (typeof window === "undefined") {
    return null;
  }

  const { ethereum } = window;
  if (!ethereum) {
    return null;
  }

  if (Array.isArray(ethereum.providers) && ethereum.providers.length > 0) {
    const metaMaskProvider = ethereum.providers.find((provider) => provider?.isMetaMask);
    return metaMaskProvider || ethereum.providers[0];
  }

  return ethereum;
}

function normalizeWalletError(error) {
  if (error?.code === 4001) {
    return "MetaMask connection request was rejected.";
  }

  const message = error?.message || "";
  if (message.includes("Failed to connect to MetaMask")) {
    return "MetaMask could not establish a connection. Open MetaMask, unlock it, then retry. If this keeps happening, disable other wallet extensions and refresh the page.";
  }

  if (message.toLowerCase().includes("already processing eth_requestaccounts")) {
    return "MetaMask is already processing a connection request. Approve it in the extension popup.";
  }

  return message || "Unable to connect wallet.";
}

export async function getProvider() {
  const injected = getInjectedProvider();
  if (!injected) {
    throw new Error("MetaMask not found. Please install MetaMask.");
  }

  const provider = new ethers.BrowserProvider(injected, "any");
  return provider;
}

export async function getSigner() {
  const provider = await getProvider();
  return provider.getSigner();
}

export async function getContract() {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export async function getReadOnlyContract() {
  const provider = await getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

export async function connectWallet() {
  const injected = getInjectedProvider();
  if (!injected) {
    throw new Error("MetaMask not found. Please install MetaMask.");
  }

  try {
    const accounts = await injected.request({ method: "eth_requestAccounts" });
    if (!Array.isArray(accounts) || accounts.length === 0) {
      throw new Error("No wallet account found after connecting.");
    }

    return ethers.getAddress(accounts[0]);
  } catch (error) {
    throw new Error(normalizeWalletError(error));
  }
}

export async function addHardhatNetwork() {
  const injected = getInjectedProvider();
  if (!injected) {
    throw new Error("MetaMask not found.");
  }

  try {
    await injected.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x7a69", // 31337 in hex
          chainName: "Hardhat Local",
          nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: ["http://127.0.0.1:8545"],
          blockExplorerUrls: [],
        },
      ],
    });
  } catch (error) {
    if (error.code === 4001) {
      throw new Error("Network addition was rejected.");
    }
    throw error;
  }
}
