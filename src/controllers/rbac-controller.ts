import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success-respone";
import {
    createResource,
    createRole,
    resourceList,
    roleList,
} from "../services/rbac-service";

/**
 * @description create a new role
 * @param req
 * @param res
 * @param next
 */
export const newRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    new SuccessResponse({
        message: "created role",
        metadata: await createRole(req.body),
    }).send(res);
};

export const newResource = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    new SuccessResponse(
        "created resource",
        await createResource(req.body)
    ).send(res);
};

export const listRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    new SuccessResponse({
        message: "get list role",
        metadata: await roleList(req.query),
    }).send(res);
};

export const listResource = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    new SuccessResponse({
        message: "get list resource",
        metadata: await resourceList(req.query),
    }).send(res);
};
