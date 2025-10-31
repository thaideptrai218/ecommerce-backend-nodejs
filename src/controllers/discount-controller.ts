import type { Request, Response, NextFunction } from "express";
import { DiscountService } from "../services/discount-service";
import { asyncHandler } from "../helpers/asyncHandler";
import { Created, OK } from "../core/success-respone";

class DiscountController {
    createDiscountCode = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { userId } = req.user;
            const discount = await DiscountService.createDiscountCode({
                ...req.body,
                shopId: userId,
            });
            return new Created("Discount code created successfully!", discount).send(res);
        }
    );

    updateDiscountCode = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { userId } = req.user;
            const { discountId } = req.params;
            const discount = await DiscountService.updateDiscountCode({
                discountId,
                shopId: userId,
                updateData: req.body,
            });
            return new OK("Discount code updated successfully!", discount).send(res);
        }
    );

    getAllDiscountCodesByShop = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { userId } = req.user;
            const { limit = 50, page = 1, sort = "createdAt", is_active = true } = req.query;

            const result = await DiscountService.getDiscountCodesByShopId({
                shopId: userId,
                limit: Number(limit),
                page: Number(page),
                sort: sort as "createdAt" | "name" | "value" | "endDate",
                is_active: is_active === "true",
            });
            return new OK("Get discount codes successfully!", result).send(res);
        }
    );

    getDiscountCodeWithProducts = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { code } = req.params;
            const { userId } = req.user;
            const { limit = 50, page = 1 } = req.query;

            const result = await DiscountService.getAllDiscountCodeWithProduct({
                code,
                shopId: userId,
                limit: Number(limit),
                page: Number(page),
            });
            return new OK("Get discount code with products successfully!", result).send(res);
        }
    );

    getDiscountAmount = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { userId } = req.user;
            const { codeId } = req.params;
            const { shopId, products } = req.body;

            const result = await DiscountService.getDiscountAmount({
                codeId,
                userId,
                shopId,
                products,
            });
            return new OK("Get discount amount successfully!", result).send(res);
        }
    );

    deleteDiscountCode = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { userId } = req.user;
            const { discountId } = req.params;

            const result = await DiscountService.deleteDiscountCode({
                discountId,
                shopId: userId,
            });
            return new OK("Discount code deleted successfully!", result).send(res);
        }
    );

    cancelDiscountCode = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { userId } = req.user;
            const { codeId } = req.params;
            const { shopId } = req.body;

            const result = await DiscountService.cancelDiscountCode({
                codeId,
                userId,
                shopId,
            });
            return new OK("Discount code cancelled successfully!", result).send(res);
        }
    );
}

export default new DiscountController();