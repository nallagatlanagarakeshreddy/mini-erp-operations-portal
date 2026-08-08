import { Router } from "express";
import * as supplierController from "../controllers/supplier.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", requireRole("ADMIN", "WAREHOUSE"), supplierController.createSupplier);
router.get("/", supplierController.getSuppliers);
router.get("/:id", supplierController.getSupplierById);
router.put("/:id", requireRole("ADMIN", "WAREHOUSE"), supplierController.updateSupplier);

export default router;
