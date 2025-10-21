import { shopModel } from "../models/shop-model";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { KeyTokenService } from "./key-token-service";
import { createTokenPair } from "../auth/auth-util";
import { connect } from "http2";
import { getInfoData } from "../utils/object-utils";

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
        try {
            // Step 1: check email exists??
            const holderShop = await shopModel.findOne({ email }).lean();

            if (holderShop) {
                return {
                    code: "xxxx",
                    message: "Shop already registerd!",
                };
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: RoleShop.SHOP,
            });

            if (newShop) {
                // Create privateKey, publicKey
                const { privateKey, publicKey } = crypto.generateKeyPairSync(
                    "rsa",
                    {
                        modulusLength: 2048,
                        publicKeyEncoding: {
                            type: "spki",
                            format: "pem",
                        },
                        privateKeyEncoding: {
                            type: "pkcs8",
                            format: "pem",
                        },
                    }
                );

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userid: newShop._id,
                    publicKey,
                });

                if (!publicKeyString) {
                    return {
                        code: "xxxx",
                        message: "publicKeyStringError",
                    };
                }
                const publicKeyObject = crypto.createPublicKey(publicKey);
                console.log(publicKeyObject);

                const token = await createTokenPair(
                    { userId: newShop._id, email },
                    publicKeyString,
                    privateKey
                );
                console.log(`Created Token Success::`, token);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({
                            fields: ["_id", "name", "email"],
                            object: newShop,
                        }),
                        token,
                    },
                };
            } else {
                return {
                    code: 500,
                    metadata: null,
                    message: "Error database cannot insert!",
                };
            }
        } catch (error: any) {
            return {
                code: "xxx",
                message: error.message,
                status: "error",
            };
        }
    };
}

export default AccessService;
