import { Request, Response, NextFunction } from "express";
import * as supplierService from "../services/supplier.service";
import { createSupplierSchema, updateSupplierSchema } from "../validators/supplier.validator";

export const createSupplier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createSupplierSchema.parse(req.body);
    const supplier = await supplierService.createSupplier(validatedData);
    res.status(201).json({ success: true, data: supplier });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(422).json({ success: false, message: "Validation Error", error: error.errors });
      return;
    }
    next(error);
  }
};

export const getSuppliers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string;
    const suppliers = await supplierService.getSuppliers(search);
    res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    next(error);
  }
};

export const getSupplierById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supplier = await supplierService.getSupplierById((req.params.id as string));
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateSupplierSchema.parse(req.body);
    const supplier = await supplierService.updateSupplier((req.params.id as string), validatedData);
    res.status(200).json({ success: true, data: supplier });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(422).json({ success: false, message: "Validation Error", error: error.errors });
      return;
    }
    next(error);
  }
};
