import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// View access for all roles
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.get("/:id/stock-movements", productController.getStockMovements);

// Modifying products and stock requires ADMIN or WAREHOUSE
router.post("/", requireRole("ADMIN", "WAREHOUSE"), productController.createProduct);
router.put("/:id", requireRole("ADMIN", "WAREHOUSE"), productController.updateProduct);
router.delete("/:id", requireRole("ADMIN", "WAREHOUSE"), productController.deleteProduct);

// Global stock movement route
router.get("/stock-movements", productController.getAllStockMovements);
router.post("/stock-movements", requireRole("ADMIN", "WAREHOUSE"), productController.createStockMovement);

export default router;
