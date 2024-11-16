import express from "express";
import canvasController from "../controllers/canvasController.js";

const router = express.Router();

router.get("/canvases", canvasController.getAllCanvases);

router.get(
  "/addresses/:walletAddress/canvases/generated",
  canvasController.getGeneratedCanvases
);

router.get(
  "/addresses/:walletAddress/canvases/joined",
  canvasController.getJoinedCanvases
);

router.get("/canvases/:canvasId", canvasController.getCanvas);

export default router;
