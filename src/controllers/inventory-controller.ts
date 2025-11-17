import type { Request, Response } from "express";
import { NotFoundError, BadRequestError } from "../core/error-respone";
import { OK, Created } from "../core/success-respone";
import { Types } from "mongoose";
import { asyncHandler } from "../helpers/asyncHandler";
import { InventoryService } from "../services/inventory-service";

class InvetoryController {
    /**
     * @description Review checkout order with pricing and discounts
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with checkout review
     */
    addStocckToInventory = asyncHandler(async (req: Request, res: Response) => {
        return new OK(
            "Checkout review completed!",
            await InventoryService.addStockToInventory(req.body)
        ).send(res);
    });
}

export default new InvetoryController();
