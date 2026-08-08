import prisma from "../config/db";
import { z } from "zod";
import { createPoSchema } from "../validators/po.validator";

const generatePoNumber = async () => {
  const count = await prisma.purchaseOrder.count();
  return `PO-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
};

export const createPo = async (data: z.infer<typeof createPoSchema>, userId: string) => {
  const poNumber = await generatePoNumber();
  
  // Calculate totals and fetch product info
  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  
  let totalQuantity = 0;
  let totalAmount = 0;
  
  const poItemsData = data.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw { status: 400, message: `Product ${item.productId} not found` };
    
    const subtotal = item.quantity * product.unitPrice;
    totalQuantity += item.quantity;
    totalAmount += subtotal;
    
    return {
      productId: product.id,
      productNameSnapshot: product.productName,
      skuSnapshot: product.sku,
      unitCostSnapshot: product.unitPrice,
      quantity: item.quantity,
      subtotal,
    };
  });

  return await prisma.purchaseOrder.create({
    data: {
      poNumber,
      supplierId: data.supplierId,
      totalQuantity,
      totalAmount,
      createdBy: userId,
      items: { create: poItemsData },
    },
    include: { items: true },
  });
};

export const getPos = async () => {
  return await prisma.purchaseOrder.findMany({
    include: { supplier: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getPoById = async (id: string) => {
  const po = await prisma.purchaseOrder.findUnique({
    where: { id },
    include: { supplier: true, items: true },
  });
  if (!po) throw { status: 404, message: "Purchase Order not found" };
  return po;
};

export const receivePo = async (id: string, userId: string) => {
  return await prisma.$transaction(async (tx) => {
    const po = await tx.purchaseOrder.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!po) throw { status: 404, message: "Purchase Order not found" };
    if (po.status !== "DRAFT" && po.status !== "SENT") {
      throw { status: 400, message: "Only DRAFT or SENT Purchase Orders can be received" };
    }

    // Process Stock Movement IN
    for (const item of po.items) {
      // 1. Update product stock
      await tx.product.update({
        where: { id: item.productId },
        data: { currentStock: { increment: item.quantity } },
      });

      // 2. Create StockMovement Ledger Entry
      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          quantityChanged: item.quantity,
          movementType: "IN",
          reason: `Received PO ${po.poNumber}`,
          createdBy: userId,
        },
      });
    }

    // Mark PO as received
    return await tx.purchaseOrder.update({
      where: { id },
      data: { status: "RECEIVED" },
      include: { supplier: true, items: true },
    });
  });
};
