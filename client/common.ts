import { holesky, sepolia } from "./src/config";

export const DEPLOYER_CONTRACT_ADDRESSES = {
  [holesky.id]: import.meta.env.VITE_PUBLIC_DEPLOYER_ADDRESS_HOLESKY,
  [sepolia.id]: import.meta.env.VITE_PUBLIC_DEPLOYER_ADDRESS_SEPOLIA,
};

export const contractAbi = [];

export const canvasContractAbi = [];
