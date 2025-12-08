import type { Request, Response, NextFunction } from "express";
import AccessService from "../services/access-service";
import { asyncHandler } from "../helpers/asyncHandler";
import { sendSuccessResponse } from "../helpers/responseHandler";
import { BadRequestError } from "../core/error-respone";

class AccessController {
    handleRefreshToken = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const response = await AccessService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            });
            return sendSuccessResponse(res, response);
        }
    );
    logout = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const response = await AccessService.logout({
                keyStore: req.keyStore,
            });
            return sendSuccessResponse(res, response);
        }
    );

    signUp = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const response = await AccessService.signUp(req.body);
            return sendSuccessResponse(res, response);
        }
    );

    login = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { email } = req.body;

            if (!email) {
                throw new BadRequestError("email missing", 666);
            }
            const response = await AccessService.login(req.body);
            return sendSuccessResponse(res, response);
        }
    );
}

export default new AccessController();
