import prisma from "../config/db";
import { z } from "zod";
import { createSupplierSchema, updateSupplierSchema } from "../validators/supplier.validator";

export const createSupplier = async (data: z.infer<typeof createSupplierSchema>) => {
  return await prisma.supplier.create({ data });
};

export const getSuppliers = async (search?: string) => {
  if (search) {
    return await prisma.supplier.findMany({
      where: {
        OR: [
          { supplierName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }
  return await prisma.supplier.findMany({ orderBy: { createdAt: "desc" } });
};

export const getSupplierById = async (id: string) => {
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier) throw { status: 404, message: "Supplier not found" };
  return supplier;
};

export const updateSupplier = async (id: string, data: z.infer<typeof updateSupplierSchema>) => {
  return await prisma.supplier.update({
    where: { id },
    data,
  });
};
