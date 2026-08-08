import { Request, Response, NextFunction } from "express";
import * as challanService from "../services/challan.service";
import { createChallanSchema } from "../validators/challan.validator";

export const getChallans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as any;
    const result = await challanService.getChallans(query);
    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

export const getChallan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const challan = await challanService.getChallanById(req.params.id);
    res.status(200).json({
      success: true,
      data: challan,
    });
  } catch (error) {
    next(error);
  }
};

export const createChallan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createChallanSchema.parse(req.body);
    const challan = await challanService.createChallan(validatedData, req.user!.userId);
    res.status(201).json({
      success: true,
      data: challan,
      message: "Draft Challan created successfully",
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

export const confirmChallan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const challan = await challanService.confirmChallan(req.params.id, req.user!.userId);
    res.status(200).json({
      success: true,
      data: challan,
      message: "Challan confirmed and stock updated",
    });
  } catch (error: any) {
    next(error);
  }
};

export const cancelChallan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const challan = await challanService.cancelChallan(req.params.id);
    res.status(200).json({
      success: true,
      data: challan,
      message: "Challan cancelled",
    });
  } catch (error) {
    next(error);
  }
};
