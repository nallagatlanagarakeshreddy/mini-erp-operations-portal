import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalCustomers,
      totalProducts,
      lowStockProducts,
      totalChallans,
      confirmedChallans,
      draftChallans,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.product.count(),
      prisma.product.count({ where: { currentStock: { lt: prisma.product.fields.minimumStock } } }),
      prisma.salesChallan.count(),
      prisma.salesChallan.count({ where: { status: "CONFIRMED" } }),
      prisma.salesChallan.count({ where: { status: "DRAFT" } }),
    ]);

    // Calculate total stock value roughly
    const products = await prisma.product.findMany({ select: { currentStock: true } });
    const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);

    // Recent activities (last 5 challans)
    const recentChallans = await prisma.salesChallan.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { customerName: true } } }
    });

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        totalProducts,
        totalStock,
        lowStockProducts,
        totalChallans,
        confirmedChallans,
        draftChallans,
        recentChallans,
      },
    });
  } catch (error) {
    next(error);
  }
};
