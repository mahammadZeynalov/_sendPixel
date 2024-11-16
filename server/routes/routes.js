import express from "express";
import canvasController from "../controllers/canvasController.js";

const router = express.Router();

router.get("/canvases", canvasController.getAllCanvases);

router.get(
  "/addresses/:walletAddress/canvases/generated",
  canvasController.getGeneratedCanvases
);

export default router;
