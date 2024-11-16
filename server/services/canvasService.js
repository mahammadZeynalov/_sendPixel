import Canvas from "../models/canvasModel.js";

const getAllCanvases = async () => {
  return await Canvas.find();
};

const getGeneratedCanvases = async (owner) => {
  return await Canvas.find({ owner });
};

const getJoinedCanvases = async (walletAddress) => {
  return await Canvas.find({ pixels: walletAddress });
};

const getCanvas = async (canvasId) => {
  return await Canvas.findOne({ canvasId });
};

const initializeCanvas = async ({
  canvasId,
  owner,
  name,
  width,
  height,
  mode,
  chainId,
  destination,
  creationTime,
}) => {
  try {
    const newCanvas = new Canvas({
      canvasId,
      owner,
      name,
      width,
      height,
      mode,
      chainId,
      pixels: [],
      destination,
      creationTime,
      nounImageId: Math.floor(Math.random() * 1000) + 1,
    });

    await newCanvas.save();
    console.log(
      `Canvas with ID ${canvasId} on chainId ${chainId} created by owner ${owner}.`
    );
  } catch (error) {
    console.error("Error in initializeCanvas:", error.message);
  }
};

const registerPixel = async ({ canvasId, amount, sender }) => {
  try {
    // Find the canvas by ID
    const canvas = await Canvas.findOne({ canvasId });
    if (!canvas) {
      throw new Error(`Canvas with ID ${canvasId} not found`);
    }

    const width = canvas.width;
    const height = canvas.height;

    // Calculate required number of digits for x and y based on width and height
    const xDigits = Math.ceil(Math.log10(width)); // Number of digits needed for x
    const yDigits = Math.ceil(Math.log10(height)); // Number of digits needed for y

    console.log(`xDigits: ${xDigits}, yDigits: ${yDigits}`);

    // Validate that amount string has enough length for x, y, and RGB
    const requiredLength = xDigits + yDigits + 9; // 9 digits for RGB and xDigits + yDigits for coordinates
    if (amount.length < requiredLength) {
      throw new Error(
        `Amount format is incorrect, expected at least ${requiredLength} digits, but got ${amount.length}.`
      );
    }

    // Extract x and y from the back of the string
    const coordinatesStart = amount.length - (xDigits + yDigits); // Start position for x and y extraction
    const x = parseInt(
      amount.slice(coordinatesStart, coordinatesStart + xDigits)
    ); // Extract x
    const y = parseInt(
      amount.slice(
        coordinatesStart + xDigits,
        coordinatesStart + xDigits + yDigits
      )
    ); // Extract y

    // Ensure x and y are within the canvas dimensions
    if (x >= width || y >= height) {
      throw new Error(
        `Coordinates out of bounds: x=${x}, y=${y}, width=${width}, height=${height}`
      );
    }

    // Now extract the RGB values from the remaining part of the string
    const rgbStart = coordinatesStart - 9; // The last 9 digits before coordinates are for RGB
    const r = parseInt(amount.slice(rgbStart, rgbStart + 3)); // First 3 digits for r
    const g = parseInt(amount.slice(rgbStart + 3, rgbStart + 6)); // Next 3 digits for g
    const b = parseInt(amount.slice(rgbStart + 6, rgbStart + 9)); // Last 3 digits for b

    // Ensure RGB values are between 0-255
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error(`Invalid RGB values: r=${r}, g=${g}, b=${b}`);
    }

    // Create the pixel ID as canvasId + x + y
    const pixelId = `${canvasId}_${x}_${y}`;

    // Check if a pixel already exists at this position
    const existingPixel = canvas.pixels.find((pixel) => pixel._id === pixelId);
    if (existingPixel) {
      console.log(
        `Pixel at (${x}, ${y}) already exists on Canvas ${canvasId}.`
      );
    } else {
      // Create the new pixel
      const newPixel = {
        _id: pixelId,
        owner: sender,
        x,
        y,
        color: { r, g, b },
      };

      // Add the new pixel to the canvas
      canvas.pixels.push(newPixel);
      await canvas.save();

      console.log(
        `Pixel added to Canvas ${canvasId} at (${x}, ${y}) with color rgb(${r}, ${g}, ${b}) by ${sender}`
      );
    }
  } catch (error) {
    console.error("Error in registerPixel:", error.message);
  }
};

const transferFunds = async ({ canvasId, amount }) => {
  try {
    await Canvas.findOneAndUpdate(
      { canvasId },
      {
        totalAmount: amount,
        isFunded: true,
      }
    );
  } catch (error) {
    console.error("Error in transferFunds:", error.message);
  }
};

const canvasService = {
  getAllCanvases,
  getGeneratedCanvases,
  getJoinedCanvases,
  getCanvas,
  initializeCanvas,
  registerPixel,
  transferFunds,
};

export default canvasService;
