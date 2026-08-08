import { Router } from "express";
import * as invoiceController from "../controllers/invoice.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", invoiceController.getInvoices);
router.get("/:id", invoiceController.getInvoiceById);
router.put("/:id/status", requireRole("ADMIN", "ACCOUNTS"), invoiceController.updateInvoiceStatus);

export default router;
