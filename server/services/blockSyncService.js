import BlockSync from "../models/blockSyncModel.js";

// Update to include logIndex and contractAddress
const updateLastProcessedEvent = async ({
  contractAddress, // Add contractAddress
  blockNumber,
  transactionHash,
  logIndex,
}) => {
  await BlockSync.findOneAndUpdate(
    { contractAddress }, // Query by contract address
    {
      lastBlockNumber: blockNumber,
      lastTransactionHash: transactionHash,
      lastLogIndex: logIndex,
    },
    { upsert: true, new: true }
  );
};

const getLastProcessedEvent = async (contractAddress) => {
  const record = await BlockSync.findOne({ contractAddress }); // Query by contract address
  if (record) {
    return {
      lastBlockNumber: record.lastBlockNumber,
      lastTransactionHash: record.lastTransactionHash,
      lastLogIndex: record.lastLogIndex,
    };
  }
  return null;
};

const blockSyncService = {
  getLastProcessedEvent,
  updateLastProcessedEvent,
};

export default blockSyncService;
