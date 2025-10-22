import { shopModel } from "../models/shop-model";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { KeyTokenService } from "./key-token-service";
import { createTokenPair } from "../auth/auth-util";
import { getInfoData } from "../utils/object-utils";
import { BadRequestError, ConflictRequestError } from "../core/error-respone";
import { Created } from "../core/success-respone";

enum RoleShop {
    SHOP = "SHOP",
    WRITER = "WRITER",
    EDITOR = "EDITOR",
    ADMIN = "ADMIN",
}

class AccessService {
    static signUp = async ({
        name,
        email,
        password,
    }: {
        name: string;
        email: string;
        password: string;
    }) => {
        // Step 1: check email exists??
        const holderShop = await shopModel.findOne({ email }).lean();

        if (holderShop) {
            throw new ConflictRequestError("Shop already registered!");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: RoleShop.SHOP,
        });

        if (!newShop) {
            throw new BadRequestError("Shop creation failed");
        }

        const secretKey = crypto.randomBytes(64).toString("hex");

        const keyStore = await KeyTokenService.createKeyToken({
            userid: newShop._id,
            secretKey,
        });

        if (!keyStore) {
            throw new BadRequestError("keyStore error");
        }

        const token = await createTokenPair(
            { userId: newShop._id, email },
            secretKey
        );

        return new Created("Shop registered successfully!", {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: newShop,
            }),
            token,
        });
    };
}

export default AccessService;
