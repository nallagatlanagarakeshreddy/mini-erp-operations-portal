import { Router } from "express";
import * as poController from "../controllers/po.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", requireRole("ADMIN", "WAREHOUSE", "SALES"), poController.createPo);
router.get("/", poController.getPos);
router.get("/:id", poController.getPoById);
router.post("/:id/receive", requireRole("ADMIN", "WAREHOUSE"), poController.receivePo);

export default router;
