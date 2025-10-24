import { shopModel } from "../models/shop-model";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { KeyTokenService } from "./key-token-service";
import { createTokenPair } from "../auth/auth-util";
import { getInfoData } from "../utils/object-utils";
import {
    AuthFailureError,
    BadRequestError,
    ConflictRequestError,
    DatabaseError,
} from "../core/error-respone";
import { Created } from "../core/success-respone";
import { findByEmail } from "./shop-service";

enum RoleShop {
    SHOP = "SHOP",
    WRITER = "WRITER",
    EDITOR = "EDITOR",
    ADMIN = "ADMIN",
}

class AccessService {
    /**
     * 1. Find shop in the database by email.
     *      - If the shop doesn't exist, throw a `BadRequestError`.
     * 2. Verify the password.
     *      - Use `bcrypt.compare` to match the incoming password with the stored hash.
     *      - If they don't match, throw an `AuthFailureError`.
     * 3. Generate new cryptographic keys.
     *      - Create a new `secretKey` using `crypto.randomBytes`.
     * 4. Create new access and refresh tokens.
     *      - Use the `createTokenPair` utility.
     * 5. Store the new keys.
     *      - Use `KeyTokenService.createKeyToken` to save the `userId` and the new `secretKey`.
     * 6. Return the login response.
     *      - Include basic shop info and the generated tokens.
     */
    static login = async ({ email, password, refreshToken = null }) => {
        const holderShop = await shopModel.findOne({ email }).lean();

        if (!holderShop) throw new BadRequestError("Shop is not existed");

        const shopId = holderShop._id.toString();

        const match = await bcrypt.compare(password, holderShop.password);
        if (!match) throw new AuthFailureError("The password is not correct!");

        const secretKey = crypto.randomBytes(64).toString("hex");

        const tokens = await createTokenPair(
            { userId: shopId, email },
            secretKey
        );

        const keyStore = await KeyTokenService.createKeyToken({
            userId: shopId,
            secretKey,
            refreshToken: tokens.refreshToken,
        });

        if (!keyStore)
            throw new DatabaseError("Database Failed Internal server error!");

        return new Created("Shop login successfully!", {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: holderShop,
            }),
            tokens,
        });
    };

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
        const holderShop = await findByEmail({ email });

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

        const token = await createTokenPair(
            { userId: newShop._id.toString(), email },
            secretKey
        );

        const keyStore = await KeyTokenService.createKeyToken({
            userId: newShop._id,
            secretKey,
            refreshToken: token.refreshToken,
        });

        if (!keyStore) {
            throw new BadRequestError("keyStore error");
        }

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
