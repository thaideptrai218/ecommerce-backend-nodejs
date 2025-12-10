import { NextFunction, Request, Response } from "express";
import { AuthFailureError } from "../core/error-respone";
import rbac from "./access-control";
import { roleList } from "../services/rbac-service";

type RoleAction =
    | "createAny"
    | "createOwn"
    | "readAny"
    | "readOwn"
    | "updateAny"
    | "updateOwn"
    | "deleteAny"
    | "deleteOwn";

export const grantAccess = (action: string, resource: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            rbac.setGrants(
                await roleList({
                    userId: 9999,
                })
            );
            const roleName = req.query.role as string;
            if (!roleName) {
                throw new AuthFailureError("Invalid request");
            }

            const permission = rbac
                .can(roleName)
                [action as RoleAction](resource);
            if (!permission.granted) {
                throw new AuthFailureError("You do not have enough permission");
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
