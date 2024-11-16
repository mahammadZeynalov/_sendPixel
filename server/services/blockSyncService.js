import BlockSync from "../models/blockSyncModel.js";

const updateLastProcessedEvent = async ({
  contractAddress,
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
