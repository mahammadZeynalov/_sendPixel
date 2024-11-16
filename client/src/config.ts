import { http } from "@wagmi/core";
import { createConfig } from "@wagmi/core";
import Web3AuthConnectorInstance from "./Web3AuthConnectorInstance";
import { defineChain } from "viem";

import { PrivyClientConfig } from "@privy-io/react-auth";

import {
  holesky as holeskyDefault,
  sepolia as sepoliaDefault,
  celoAlfajores as celoAlfajoresDefault,
  baseSepolia as baseSepoliaDefault,
  lineaSepolia as lineaSepoliaDefault,
  scrollSepolia as scrollSepoliaDefault,
} from "@wagmi/core/chains";

export const backendUrl: string = import.meta.env.VITE_PUBLIC_BACKEND_URL;
const alchemyApiKey: string = import.meta.env.VITE_PUBLIC_ALCHEMY_API_KEY;

export const holesky = /*#__PURE__*/ defineChain({
  ...holeskyDefault,
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
});

export const sepolia = /*#__PURE__*/ defineChain({
  ...sepoliaDefault,
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
});

export const celoAlfajores = /*#__PURE__*/ defineChain({
  ...celoAlfajoresDefault,
  name: "Celo",
  rpcUrls: {
    default: {
      http: [`https://alfajores-forno.celo-testnet.org`],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://sepolia.etherscan.io",
      apiUrl: "https://api-sepolia.etherscan.io/api",
      blockscoutUrl: "https://celo-alfajores.blockscout.com/",
    },
  },
});

export const baseSepolia = /*#__PURE__*/ defineChain({
  ...baseSepoliaDefault,
  name: "Base",
  rpcUrls: {
    default: {
      http: [`https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://base-sepolia.blockscout.com/",
      apiUrl: "https://api-sepolia.etherscan.io/api",
      blockscoutUrl: "https://base-sepolia.blockscout.com/",
    },
  },
});

export const lineaSepolia = /*#__PURE__*/ defineChain({
  ...lineaSepoliaDefault,
  name: "Linea",
  rpcUrls: {
    default: {
      http: [`https://linea-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://sepolia.etherscan.io",
      apiUrl: "https://api-sepolia.etherscan.io/api",
      blockscoutUrl: "https://explorer.sepolia.linea.build/",
    },
  },
});

export const scrollSepolia = /*#__PURE__*/ defineChain({
  ...scrollSepoliaDefault,
  name: "Scroll",
  rpcUrls: {
    default: {
      http: [`https://scroll-sepolia.g.alchemy.com/v2/${alchemyApiKey}`],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://sepolia.scrollscan.com/",
      apiUrl: "https://api-sepolia.etherscan.io/api",
      blockscoutUrl: "https://sepolia.scrollscan.com/",
    },
  },
});

export const supportedChains = [
  holesky,
  sepolia,
  celoAlfajores,
  baseSepolia,
  lineaSepolia,
  scrollSepolia,
];
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

export const privyAppID: string = import.meta.env.VITE_PUBLIC_PRIVY_APP_ID;

export const privyConfig: PrivyClientConfig = {
  appearance: {
    accentColor: "#6A6FF5",
    theme: "#FFFFFF",
    showWalletLoginFirst: false,
    logo: "https://auth.privy.io/logos/privy-logo.png",
    walletChainType: "ethereum-only",
    walletList: ["detected_ethereum_wallets"],
  },
  loginMethods: ["google", "github", "discord", "linkedin", "wallet"],
  fundingMethodConfig: {
    moonpay: {
      useSandbox: true,
    },
  },
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: false,
  },
  mfa: {
    noPromptOnMfaRequired: false,
  },
};
