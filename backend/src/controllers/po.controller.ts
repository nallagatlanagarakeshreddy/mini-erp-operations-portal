import { Request, Response, NextFunction } from "express";
import * as poService from "../services/po.service";
import { createPoSchema } from "../validators/po.validator";

export const createPo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createPoSchema.parse(req.body);
    const userId = req.user!.userId;
    const po = await poService.createPo(validatedData, userId);
    res.status(201).json({ success: true, data: po });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(422).json({ success: false, message: "Validation Error", error: error.errors });
      return;
    }
    next(error);
  }
};

export const getPos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pos = await poService.getPos();
    res.status(200).json({ success: true, data: pos });
  } catch (error) {
    next(error);
  }
};

export const getPoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const po = await poService.getPoById((req.params.id as string));
    res.status(200).json({ success: true, data: po });
  } catch (error) {
    next(error);
  }
};

export const receivePo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const po = await poService.receivePo((req.params.id as string), userId);
    res.status(200).json({ success: true, data: po, message: "Purchase Order Received. Stock updated." });
  } catch (error) {
    next(error);
  }
};
