import { canvasContractAbi } from "../common.js";
import canvasService from "../services/canvasService.js";
import watcherService from "./watcherService.js";

const handleInitializeCanvas = async (log, chain) => {
  console.log("Handling InitializeCanvas event");
  try {
    const canvasData = {
      canvasId: log.args.deployedCanvasContract,
      owner: log.args.deployer,
      name: log.args.name,
      width: Number(log.args.width),
      height: Number(log.args.height),
      mode: Number(log.args.mode),
      chainId: Number(log.args.chainId),
      destination: log.args.destination,
      creationTime: Number(log.args.creationTime),
    };

    // Initialize the canvas in your database
    await canvasService.initializeCanvas(canvasData);

    // Start watching events from the newly deployed canvas contract
    console.log(
      `Starting listener for new Canvas contract: ${canvasData.canvasId} on chainId: ${canvasData.chainId}`
    );

    await watcherService.watchEvents(
      chain,
      canvasData.canvasId,
      canvasContractAbi,
      [{ eventName: "PixelRegistered", handleEvent: handleRegisterPixel }]
    );
  } catch (error) {
    console.error("Error in handleInitializeCanvas:", error.message);
  }
};

const eventService = {
  handleInitializeCanvas,
};

export default eventService;
