import express from "express";
import { errorHandler } from "../middleware/errorHandler.js";
import { createRepo, getRepoStatus } from "../controllers/githubController.js";

const router = express.Router();

router.post("/api/github/create-repo", createRepo);
router.get("/api/github/status/:jobId", getRepoStatus);

router.use(errorHandler);

export default router;
