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
}
