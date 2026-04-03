import { useState, useCallback } from "react";
import { getContract, getReadOnlyContract } from "../utils/contractHelper";
import toast from "react-hot-toast";

export function useContract() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseContractError = useCallback((err) => {
    if (err?.reason) return err.reason;

    const message = err?.message || "";

    if (message.includes("Product already exists")) {
      return "This Product ID already exists on the blockchain";
    }
    if (message.includes("does not exist")) {
      return "Product not found on blockchain";
    }
    if (message.includes("not the product owner")) {
      return "You are not the owner of this product";
    }
    if (message.includes("zero address")) {
      return "Invalid wallet address provided";
    }
    if (message.includes("transfer to yourself")) {
      return "Cannot transfer to your own address";
    }
    if (message.toLowerCase().includes("user rejected")) {
      return "Transaction was rejected in MetaMask";
    }
    if (message.toLowerCase().includes("insufficient funds")) {
      return "Insufficient ETH for gas fees";
    }

    return err?.message || "Transaction failed. Please try again.";
  }, []);

  const executeTransaction = useCallback(
    async (contractFn, args = [], successMessage) => {
      setLoading(true);
      setError(null);

      try {
        const contract = await getContract();
        const tx = await contract[contractFn](...args);
        toast.loading("Transaction pending...", { id: "tx" });
        const receipt = await tx.wait();
        toast.success(successMessage || "Transaction successful!", { id: "tx" });
        setLoading(false);
        return receipt;
      } catch (err) {
        setLoading(false);
        const message = parseContractError(err);
        setError(message);
        toast.error(message, { id: "tx" });
        throw err;
      }
    },
    [parseContractError]
  );

  const queryContract = useCallback(
    async (contractFn, args = []) => {
      setLoading(true);
      setError(null);

      try {
        const contract = await getReadOnlyContract();
        const result = await contract[contractFn](...args);
        setLoading(false);
        return result;
      } catch (err) {
        setLoading(false);
        const message = parseContractError(err);
        setError(message);
        throw err;
      }
    },
    [parseContractError]
  );

  return { loading, error, executeTransaction, queryContract };
}
