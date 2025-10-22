import apikeyModel from "../models/apikey-model";
import crypto from "node:crypto";

export const findById = async (key: string) => {
    // const addedKey = await apikeyModel.create({
    //     key: crypto.randomBytes(64).toString("hex"),
    //     permissions: ["0000"],
    // });
    // console.log(addedKey);
    const objectKey = await apikeyModel.findOne({ key, status: true }).lean();

    return objectKey;
};
