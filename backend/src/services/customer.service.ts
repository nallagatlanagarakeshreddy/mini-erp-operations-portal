import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createCustomerSchema, updateCustomerSchema } from "../validators/customer.validator";
import prisma from "../config/db";

export const createCustomer = async (data: z.infer<typeof createCustomerSchema>) => {
  return await prisma.customer.create({
    data,
  });
};

export const updateCustomer = async (id: string, data: z.infer<typeof updateCustomerSchema>) => {
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing) {
    throw { status: 404, message: "Customer not found" };
  }
  return await prisma.customer.update({
    where: { id },
    data,
  });
};

export const getCustomers = async (query: { search?: string; status?: string; type?: string; page?: string; limit?: string }) => {
  const page = parseInt(query.page || "1");
  const limit = parseInt(query.limit || "10");
  const skip = (page - 1) * limit;

  const where: Prisma.CustomerWhereInput = {};

  if (query.search) {
    where.OR = [
      { customerName: { contains: query.search, mode: "insensitive" } },
      { mobile: { contains: query.search } },
      { businessName: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.status) {
    where.status = query.status as any;
  }

  if (query.type) {
    where.customerType = query.type as any;
  }

  const [data, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count({ where }),
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

export const getCustomerById = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      challans: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!customer) {
    throw { status: 404, message: "Customer not found" };
  }

  return customer;
};

export const deleteCustomer = async (id: string) => {
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing) {
    throw { status: 404, message: "Customer not found" };
  }
  return await prisma.customer.delete({
    where: { id },
  });
};
