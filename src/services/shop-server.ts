import type { ProjectionType } from "mongoose";

import { shopModel } from "../models/shop-model";

export const findByEmail = async ({
    email,
    select = {
        email: 1,
        password: 1,
        name: 1,
        status: 1,
        roles: 1,
    },
}: {
    email: string;
    select?: Record<string, 0 | 1> | string;
}) => {
    return await shopModel.findOne({ email }).select(select).lean();
};
