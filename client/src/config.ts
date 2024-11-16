import { http } from "@wagmi/core";
import { createConfig } from "@wagmi/core";
import Web3AuthConnectorInstance from "./Web3AuthConnectorInstance";
import { defineChain } from "viem";

export const backendUrl: string = import.meta.env.VITE_PUBLIC_BACKEND_URL;
const alchemyApiKey: string = import.meta.env.VITE_PUBLIC_ALCHEMY_API_KEY;

export const localhost = /*#__PURE__*/ defineChain({
  id: 31337,
  name: "Localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
});

export const holesky = /*#__PURE__*/ defineChain({
  id: 17000,
  name: "Holesky",
  nativeCurrency: { name: "Holesky Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [`https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://holesky.etherscan.io",
      apiUrl: "https://api-holesky.etherscan.io/api",
      blockscoutUrl: "https://eth-holesky.blockscout.com/",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 77,
    },
    ensRegistry: {
      address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      blockCreated: 801613,
    },
    ensUniversalResolver: {
      address: "0xa6AC935D4971E3CD133b950aE053bECD16fE7f3b",
      blockCreated: 973484,
    },
  },
  testnet: true,
});

export const sepolia = /*#__PURE__*/ defineChain({
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://sepolia.etherscan.io",
      apiUrl: "https://api-sepolia.etherscan.io/api",
      blockscoutUrl: "https://eth-sepolia.blockscout.com/",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 751532,
    },
    ensRegistry: { address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" },
    ensUniversalResolver: {
      address: "0xc8Af999e38273D658BE1b921b88A9Ddf005769cC",
      blockCreated: 5317080,
    },
  },
  testnet: true,
});

export const supportedChains = [holesky, sepolia];
const transports = supportedChains.reduce((acc, chain) => {
  acc[chain.id] = http();
  return acc;
}, {});

export const config = createConfig({
  chains: supportedChains as any,
  transports,
  connectors: [Web3AuthConnectorInstance(supportedChains)],
});

export const groupChatId = import.meta.env.VITE_PUBLIC_PUSH_GROUP_ADDRESS;
