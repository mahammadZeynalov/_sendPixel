import blockSyncService from "./blockSyncService.js";
import eventService from "./eventService.js";
import { contractAbi } from "../common.js";
import { chainsConfig } from "../config.js";
import { createPublicClient, http } from "viem";

// Helper function to create an HTTP client for a given chain
const createHttpClient = (chain) =>
  createPublicClient({
    chain,
    transport: http(),
  });

// Helper function to create a WebSocket client for a given chain
const createWebSocketClient = (chain) =>
  createPublicClient({
    chain,
    transport: http(),
  });

// Function to process logs
const processLog = async (log, events, contractAddress, chain) => {
  const event = events.find((e) => e.eventName === log.eventName);

  if (event && event.handleEvent) {
    await event.handleEvent(log, chain);
  }
};

const watchEvents = async (chain, contractAddress, contractAbi, events) => {
  console.log("chain: ", chain.id);
  try {
    const clientHttp = createHttpClient(chain);
    const clientWebSocket = createWebSocketClient(chain);

    let currentBlockNumber = await clientHttp.getBlockNumber();

    currentBlockNumber = BigInt(lastProcessedEvent.lastBlockNumber);

    clientWebSocket.watchContractEvent({
      address: contractAddress,
      abi: contractAbi,
      fromBlock: lastProcessedEvent
        ? currentBlockNumber + 1n
        : currentBlockNumber,
      onLogs: async (logs) => {
        console.log(`Received logs on ${chain.name}:`, logs);
        try {
          for (const log of logs) {
            await processLog(log, events, contractAddress, chain);
          }
        } catch (error) {
          console.error(`Error handling event logs on ${chain.name}:`, error);
        }
      },
    });
  } catch (error) {
    console.error(
      `Error setting up watcher for events on ${chain.name}:`,
      error
    );
  }
};

// Start watchers for all configured chains
const startDeployerWatcher = async () => {
  const events = [
    {
      eventName: "CanvasDeployed",
      handleEvent: eventService.handleInitializeCanvas,
    },
  ];

  try {
    await watchEvents(chain, contractAddress, contractAbi, events);
  } catch (error) {
    console.error("Failed to start event watcher:", error);
  }
};

const watcherService = {
  watchEvents,
  startDeployerWatcher,
};

export default watcherService;
