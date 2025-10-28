import apikeyModel from "../models/apikey-model";

export const findById = async (key: string) => {
    const objectKey = await apikeyModel.findOne({ key, status: true }).lean();
    return objectKey;
};
