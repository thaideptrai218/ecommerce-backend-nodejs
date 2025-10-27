
import { Types } from "mongoose";

export interface IKeyToken extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    secretKey: string;
    refreshTokenUsed: string[];
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    updateOne(update: any): Promise<any>;
}
