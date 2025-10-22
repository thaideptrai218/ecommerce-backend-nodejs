import type { Request, Response, NextFunction } from "express";
import AccessService from "../services/access-service";
import { asyncHandler } from "../helpers/asyncHandler";

class AccessController {
    signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        return res.status(200).json(await AccessService.signUp(req.body));
    });
}

export default new AccessController();
