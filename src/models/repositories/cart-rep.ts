import { convertToObjectIdMongodb } from "../../utils";
import cartModel from "../cart-model";

export class CartRepository {
    static async findCartById(cartId: string) {
        return await cartModel
            .findOne({
                _id: convertToObjectIdMongodb(cartId),
                cart_state: "active",
            })
            .lean();
    }

    static async deleteUserCart(userId: number) {
        return await cartModel.deleteOne({
            cart_userId: userId,
        });
    }
}
