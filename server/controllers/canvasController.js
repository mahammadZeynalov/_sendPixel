import canvasService from "../services/canvasService.js";

const getAllCanvases = async (_, res) => {
  try {
    const canvases = await canvasService.getAllCanvases();
    res.status(200).json(canvases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const canvasController = {
  getAllCanvases,
};

export default canvasController;
