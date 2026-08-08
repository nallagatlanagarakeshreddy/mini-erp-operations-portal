import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createChallanSchema } from "../validators/challan.validator";
import prisma from "../config/db";

// Utility to generate challan number
const generateChallanNumber = async () => {
  const currentYear = new Date().getFullYear();
  const lastChallan = await prisma.salesChallan.findFirst({
    where: { challanNumber: { startsWith: `CH-${currentYear}-` } },
    orderBy: { challanNumber: "desc" },
  });

  if (!lastChallan) {
    return `CH-${currentYear}-0001`;
  }

  const lastSequence = parseInt(lastChallan.challanNumber.split("-")[2], 10);
  const nextSequence = (lastSequence + 1).toString().padStart(4, "0");
  return `CH-${currentYear}-${nextSequence}`;
};

export const createChallan = async (data: z.infer<typeof createChallanSchema>, userId: string) => {
  const challanNumber = await generateChallanNumber();

  // Get product details for snapshot
  const productIds = data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== data.items.length) {
    throw { status: 400, message: "One or more products not found" };
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  let totalQuantity = 0;

  const challanItemsData = data.items.map((item) => {
    const product = productMap.get(item.productId)!;
    totalQuantity += item.quantity;

    return {
      productId: product.id,
      productNameSnapshot: product.productName,
      skuSnapshot: product.sku,
      unitPriceSnapshot: product.unitPrice,
      quantity: item.quantity,
      subtotal: product.unitPrice * item.quantity,
    };
  });

  return await prisma.salesChallan.create({
    data: {
      challanNumber,
      customerId: data.customerId,
      totalQuantity,
      status: "DRAFT",
      createdBy: userId,
      items: {
        create: challanItemsData,
      },
    },
    include: {
      items: true,
      customer: true,
    },
  });
};

export const confirmChallan = async (id: string, userId: string) => {
  return await prisma.$transaction(async (tx) => {
    const challan = await tx.salesChallan.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!challan) {
      throw { status: 404, message: "Challan not found" };
    }

    if (challan.status !== "DRAFT") {
      throw { status: 400, message: "Only DRAFT challans can be confirmed" };
    }

    // Verify stock and create movements
    for (const item of challan.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      
      if (!product) {
        throw { status: 400, message: `Product ${item.productNameSnapshot} no longer exists` };
      }

      if (product.currentStock < item.quantity) {
        throw { 
          status: 400, 
          message: `Insufficient stock for product: ${product.productName}. Required: ${item.quantity}, Available: ${product.currentStock}`,
          error: "INSUFFICIENT_STOCK"
        };
      }

      // Update product stock
      await tx.product.update({
        where: { id: product.id },
        data: { currentStock: product.currentStock - item.quantity },
      });

      // 3. Create StockMovement Ledger Entry
      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          quantityChanged: item.quantity,
          movementType: "OUT",
          reason: `Sales Challan ${challan.challanNumber}`,
          createdBy: "SYSTEM",
        },
      });
    }

    // 4. Create an Invoice automatically
    const totalAmount = challan.items.reduce((acc, item) => acc + item.subtotal, 0);
    const invoiceNumber = `INV-${challan.challanNumber.split("-")[1]}-${challan.challanNumber.split("-")[2]}`;
    await tx.invoice.create({
      data: {
        invoiceNumber,
        challanId: id,
        totalAmount,
      },
    });

    // 5. Update Challan status
    return await tx.salesChallan.update({
      where: { id },
      data: { status: "CONFIRMED" },
      include: { customer: true, items: true },
    });
  });
};

export const cancelChallan = async (id: string) => {
  const challan = await prisma.salesChallan.findUnique({ where: { id } });
  
  if (!challan) {
    throw { status: 404, message: "Challan not found" };
  }

  if (challan.status === "CONFIRMED") {
    throw { status: 400, message: "Cannot cancel a confirmed challan directly. Manual stock reversal required." };
  }

  return await prisma.salesChallan.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
};

export const getChallans = async (query: { status?: string; page?: string; limit?: string; customerId?: string }) => {
  const page = parseInt(query.page || "1");
  const limit = parseInt(query.limit || "10");
  const skip = (page - 1) * limit;

  const where: Prisma.SalesChallanWhereInput = {};

  if (query.status) {
    where.status = query.status as any;
  }
  
  if (query.customerId) {
    where.customerId = query.customerId;
  }

  const [data, total] = await Promise.all([
    prisma.salesChallan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: { customerName: true, businessName: true }
        }
      }
    }),
    prisma.salesChallan.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getChallanById = async (id: string) => {
  const challan = await prisma.salesChallan.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true }
      },
      customer: true,
    },
  });

  if (!challan) {
    throw { status: 404, message: "Challan not found" };
  }

  return challan;
};
