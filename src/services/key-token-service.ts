import { Types } from "mongoose";
import keyTokenModel from "../models/key-token-model";

export class KeyTokenService {
    static createKeyToken = async ({
        userId,
        secretKey,
        refreshToken,
    }: {
        userId: string | any;
        secretKey: string;
        refreshToken: string;
    }) => {
        const filter = { user: userId };
        const update = { secretKey, refreshTokenUsed: [], refreshToken };
        const options = { upsert: true, new: true };

        const keyStore = await keyTokenModel.findOneAndUpdate(
            filter,
            update,
            options
        );

        return keyStore ? keyStore.secretKey : null;
    };

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({
            user: new Types.ObjectId(userId),
        });
    };

    static removeKeyByUserId = async (userId) => {
        return await keyTokenModel.deleteOne({ user: userId }).lean();
    };

    static removeKeyById = async (id: Types.ObjectId) => {
        return await keyTokenModel.findByIdAndDelete(id).lean();
    };

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel
            .findOne({ refreshTokenUsed: refreshToken })
            .lean();
    };

    static deletekey = async (userId) => {
        return await keyTokenModel.findByIdAndDelete(userId).lean();
    };

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken: refreshToken });
    };
}
