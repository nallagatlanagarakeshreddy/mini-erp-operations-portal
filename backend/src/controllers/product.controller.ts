import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";
import { createProductSchema, updateProductSchema, stockMovementSchema } from "../validators/product.validator";

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as any;
    const result = await productService.getProducts(query);
    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const product = await productService.createProduct(validatedData);
    res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
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

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateProductSchema.parse(req.body);
    const product = await productService.updateProduct(req.params.id, validatedData);
    res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
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

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createStockMovement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = stockMovementSchema.parse(req.body);
    const movement = await productService.createStockMovement(validatedData, req.user!.userId);
    res.status(201).json({
      success: true,
      data: movement,
      message: "Stock movement recorded successfully",
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

export const getAllStockMovements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movements = await productService.getAllStockMovements();
    res.status(200).json({
      success: true,
      data: movements,
    });
  } catch (error) {
    next(error);
  }
};

export const getStockMovements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movements = await productService.getStockMovements(req.params.id);
    res.status(200).json({
      success: true,
      data: movements,
    });
  } catch (error) {
    next(error);
  }
};
