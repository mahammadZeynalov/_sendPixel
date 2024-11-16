import canvasService from "../services/canvasService.js";

const getAllCanvases = async (_, res) => {
  try {
    const canvases = await canvasService.getAllCanvases();
    res.status(200).json(canvases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGeneratedCanvases = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const canvases = await canvasService.getGeneratedCanvases(walletAddress);
    res.status(200).json(canvases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const canvasController = {
  getAllCanvases,
  getGeneratedCanvases,
};

export default canvasController;
