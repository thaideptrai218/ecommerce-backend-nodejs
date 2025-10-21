import type { Request, Response, NextFunction } from "express";
import AccessService from "../services/access-service";

class AccessController {
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(`[P]::signUp::`, req.body);
            return res.status(200).json(await AccessService.signUp(req.body));
        } catch (error) {
            next(error);
        }
    };
}

export default new AccessController();
