import type { Request, Response, NextFunction } from "express";
import AccessService from "../services/access-service";
import { asyncHandler } from "../helpers/asyncHandler";
import { sendSuccessResponse } from "../helpers/responseHandler";

class AccessController {
    signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const response = await AccessService.signUp(req.body);
        return sendSuccessResponse(res, response);
    });

    login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const response = await AccessService.login(req.body);
        return sendSuccessResponse(res, response);
    });
}

export default new AccessController();
