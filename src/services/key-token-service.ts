import keyTokenModel from "../models/key-token-model";

export class KeyTokenService {
    static createKeyToken = async ({
        userid,
        secretKey,
    }: {
        userid: string | any;
        secretKey: string;
    }) => {
        const token = await keyTokenModel.create({
            user: userid,
            secretKey,
        });

        return token ? token.secretKey : null;
    };
}
