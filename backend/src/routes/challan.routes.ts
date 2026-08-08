import { Router } from "express";
import * as challanController from "../controllers/challan.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// View access for all
router.get("/", challanController.getChallans);
router.get("/:id", challanController.getChallan);

// Creation by ADMIN and SALES
router.post("/", requireRole("ADMIN", "SALES"), challanController.createChallan);

// Confirm/Cancel by ADMIN and SALES
router.post("/:id/confirm", requireRole("ADMIN", "SALES"), challanController.confirmChallan);
router.post("/:id/cancel", requireRole("ADMIN", "SALES"), challanController.cancelChallan);

export default router;
