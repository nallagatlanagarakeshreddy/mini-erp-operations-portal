import { Request, Response, NextFunction } from "express";
import * as customerService from "../services/customer.service";
import { createCustomerSchema, updateCustomerSchema } from "../validators/customer.validator";

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as any;
    const result = await customerService.getCustomers(query);
    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await customerService.getCustomerById((req.params.id as string));
    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCustomerSchema.parse(req.body);
    const customer = await customerService.createCustomer(validatedData);
    res.status(201).json({
      success: true,
      data: customer,
      message: "Customer created successfully",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(422).json({
        success: false,
        message: "Validation Error",
        error: error.errors,
      });
      return;
    }
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateCustomerSchema.parse(req.body);
    const customer = await customerService.updateCustomer((req.params.id as string), validatedData);
    res.status(200).json({
      success: true,
      data: customer,
      message: "Customer updated successfully",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(422).json({
        success: false,
        message: "Validation Error",
        error: error.errors,
      });
      return;
    }
    next(error);
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await customerService.deleteCustomer((req.params.id as string));
    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
