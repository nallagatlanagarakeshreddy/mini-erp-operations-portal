import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createProductSchema, updateProductSchema, stockMovementSchema } from "../validators/product.validator";
import prisma from "../config/db";

export const createProduct = async (data: z.infer<typeof createProductSchema>) => {
  const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
  if (existing) {
    throw { status: 409, message: "Product with this SKU already exists" };
  }
  return await prisma.product.create({
    data,
  });
};

export const updateProduct = async (id: string, data: z.infer<typeof updateProductSchema>) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw { status: 404, message: "Product not found" };
  }

  if (data.sku && data.sku !== existing.sku) {
    const skuExists = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (skuExists) {
      throw { status: 409, message: "Product with this SKU already exists" };
    }
  }

  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const getProducts = async (query: { search?: string; category?: string; page?: string; limit?: string }) => {
  const page = parseInt(query.page || "1");
  const limit = parseInt(query.limit || "10");
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};

  if (query.search) {
    where.OR = [
      { productName: { contains: query.search, mode: "insensitive" } },
      { sku: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.category) {
    where.category = query.category;
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
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

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw { status: 404, message: "Product not found" };
  }

  return product;
};

export const deleteProduct = async (id: string) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw { status: 404, message: "Product not found" };
  }
  return await prisma.product.delete({
    where: { id },
  });
};

export const createStockMovement = async (data: z.infer<typeof stockMovementSchema>, userId: string) => {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: data.productId } });
    if (!product) {
      throw { status: 404, message: "Product not found" };
    }

    if (data.movementType === "OUT" && product.currentStock < data.quantityChanged) {
      throw { status: 400, message: "Insufficient stock", error: "INSUFFICIENT_STOCK" };
    }

    const newStock = data.movementType === "IN"
      ? product.currentStock + data.quantityChanged
      : product.currentStock - data.quantityChanged;

    const movement = await tx.stockMovement.create({
      data: {
        productId: data.productId,
        quantityChanged: data.quantityChanged,
        movementType: data.movementType,
        reason: data.reason,
        createdBy: userId,
      },
    });

    await tx.product.update({
      where: { id: data.productId },
      data: { currentStock: newStock },
    });

    return movement;
  });
};

export const getAllStockMovements = async () => {
  return await prisma.stockMovement.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getStockMovements = async (productId: string) => {
  return await prisma.stockMovement.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
};
