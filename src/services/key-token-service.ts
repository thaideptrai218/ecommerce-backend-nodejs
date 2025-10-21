import keyTokenModel from "../models/key-token-model";

export class KeyTokenService {
    static createKeyToken = async ({
        userid,
        publicKey,
    }: {
        userid: string | any;
        publicKey: string;
    }) => {
        try {
            const token = await keyTokenModel.create({
                user: userid,
                publicKey,
            });

            return token ? token.publicKey : null;
        } catch (error) {
            return error;
        }
    };
}
