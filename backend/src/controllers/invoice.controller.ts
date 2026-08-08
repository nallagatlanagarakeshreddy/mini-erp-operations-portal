import { Request, Response, NextFunction } from "express";
import * as invoiceService from "../services/invoice.service";
import { updateInvoiceStatusSchema } from "../validators/invoice.validator";

export const getInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoices = await invoiceService.getInvoices();
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const updateInvoiceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateInvoiceStatusSchema.parse(req.body);
    const invoice = await invoiceService.updateInvoiceStatus(req.params.id, validatedData);
    res.status(200).json({ success: true, data: invoice });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(422).json({ success: false, message: "Validation Error", error: error.errors });
      return;
    }
    next(error);
  }
};
