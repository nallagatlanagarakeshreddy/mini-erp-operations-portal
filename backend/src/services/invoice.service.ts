import prisma from "../config/db";
import { z } from "zod";
import { updateInvoiceStatusSchema } from "../validators/invoice.validator";

export const getInvoices = async () => {
  return await prisma.invoice.findMany({
    include: { challan: { include: { customer: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const getInvoiceById = async (id: string) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { challan: { include: { customer: true, items: true } } },
  });
  if (!invoice) throw { status: 404, message: "Invoice not found" };
  return invoice;
};

export const updateInvoiceStatus = async (id: string, data: z.infer<typeof updateInvoiceStatusSchema>) => {
  return await prisma.invoice.update({
    where: { id },
    data: {
      status: data.status,
      amountPaid: data.amountPaid !== undefined ? data.amountPaid : undefined,
    },
    include: { challan: { include: { customer: true } } },
  });
};
