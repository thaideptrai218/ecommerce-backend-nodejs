import { Types } from "mongoose";

export const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

export const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};

export const removeUndefinedNull = (obj) => {
    Object.keys(obj).forEach((k) => {
        if (obj[k] && typeof obj[k] === "object") {
            removeUndefinedNull(obj[k]);
        }
        if (obj[k] == null) {
            delete obj[k];
        }
    });
    return obj;
};
/**
   {
     "product_attributes": {
       "details": {
         "material": "Cotton",
         "brand": "Gemini"
       }
     }
   }
 */
export const updateNestedObjectParser = (obj) => {
    const final = {};
    Object.keys(obj).forEach((k) => {
        if (obj[k] && typeof obj[k] === "object" && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k]);
            Object.keys(response).forEach((a) => {
                final[`${k}.${a}`] = response[a];
            });
        } else {
            final[k] = obj[k];
        }
    });
    return final;
};

export const convertToObjectIdMongodb = (id: string) => new Types.ObjectId(id);
