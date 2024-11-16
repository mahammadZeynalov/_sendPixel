import dotenv from "dotenv";

import {
  holesky,
  sepolia,
  celoAlfajores,
  baseSepolia,
  lineaSepolia,
  scrollSepolia,
} from "viem/chains";

dotenv.config({ path: "./.env" });

const alchemyApiKey = process.env.ALCHEMY_API_KEY;

export const chainsConfig = [
  {
    chain: holesky,
    rpc: `https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`,
    contractAddress: process.env.DEPLOYER_ADDRESS_HOLESKY,
  },
  {
    chain: sepolia,
    rpc: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    contractAddress: process.env.DEPLOYER_ADDRESS_SEPOLIA,
  },
  {
    chain: celoAlfajores,
    rpc: `https://alfajores-forno.celo-testnet.org`,
    contractAddress: process.env.DEPLOYER_ADDRESS_CELO_ALFAJORES,
  },
  {
    chain: baseSepolia,
    rpc: `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    contractAddress: process.env.DEPLOYER_ADDRESS_BASE_SEPOLIA,
  },
  {
    chain: lineaSepolia,
    rpc: `https://linea-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    contractAddress: process.env.DEPLOYER_ADDRESS_LINEA_SEPOLIA,
  },
  {
    chain: scrollSepolia,
    rpc: `https://scroll-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    contractAddress: process.env.DEPLOYER_ADDRESS_SCROLL_SEPOLIA,
  },
];
