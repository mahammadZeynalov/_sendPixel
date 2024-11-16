import { verifyCloudProof } from "@worldcoin/idkit-core/backend";
import Canvas from "../models/canvasModel.js";

const initVerification = async (req, res) => {
  try {
    const proof = req.body.proof;
    const canvasId = req.body.canvasId;
    const appId = process.env.WORLD_APP_ID;
    const action = process.env.WORLD_ACTION;
    const verifyRes = await verifyCloudProof(proof, appId, action);
    if (verifyRes.success) {
      await Canvas.findOneAndUpdate(
        { canvasId },
        {
          worldIdVerified: true,
        }
      );
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({
        success: false,
        code: verifyRes.code,
        attribute: verifyRes.attribute,
        detail: verifyRes.detail,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const worldIdController = {
  initVerification,
};

export default worldIdController;
