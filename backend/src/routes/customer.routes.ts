import { Router } from "express";
import * as customerController from "../controllers/customer.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

// Protect all customer routes
router.use(authenticate);

// Admin and Sales have full access, Accounts can view
router.get("/", requireRole("ADMIN", "SALES", "ACCOUNTS"), customerController.getCustomers);
router.get("/:id", requireRole("ADMIN", "SALES", "ACCOUNTS"), customerController.getCustomer);
router.post("/", requireRole("ADMIN", "SALES"), customerController.createCustomer);
router.put("/:id", requireRole("ADMIN", "SALES"), customerController.updateCustomer);
router.delete("/:id", requireRole("ADMIN", "SALES"), customerController.deleteCustomer);

export default router;
