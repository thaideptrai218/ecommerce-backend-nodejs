import { SpuModel } from "../spu.model";
import { getSelectData, convertToObjectIdMongodb } from "../../utils";
import { Types } from "mongoose";

class SpuRepository {
  static async createSpu(spu: any) {
    return await SpuModel.create(spu);
  }

  static async findSpuById(spu_id: string) {
    if (!Types.ObjectId.isValid(spu_id)) return null;
    return await SpuModel.findById(spu_id).lean();
  }

  static async findSpuByUniqueId(product_id: string) {
    return await SpuModel.findOne({ product_id }).lean();
  }

  static async findAllSpus({
    limit,
    sort,
    page,
    filter,
    select,
  }: {
    limit: number;
    sort: string;
    page: number;
    filter: any;
    select: string[];
  }) {
    const skip = (page - 1) * limit;
    const sortBy: any = sort === "ctime" ? { _id: -1 } : { _id: 1 };

    return await SpuModel.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select as any))
      .lean();
  }

  static async updateSpu(spu_id: string, payload: any) {
    if (!Types.ObjectId.isValid(spu_id)) return null;
    return await SpuModel.findByIdAndUpdate(spu_id, payload, { new: true }).lean();
  }

  static async publishSpuByShop({
    product_shop,
    spu_id,
  }: {
    product_shop: string;
    spu_id: string;
  }) {
    if (!Types.ObjectId.isValid(product_shop) || !Types.ObjectId.isValid(spu_id)) {
      return null;
    }

    return await SpuModel.findOneAndUpdate(
      {
        _id: convertToObjectIdMongodb(spu_id),
        product_shop: convertToObjectIdMongodb(product_shop),
        isDeleted: false
      },
      { isDraft: false, isPublished: true },
      { new: true }
    ).lean();
  }

  static async unpublishSpuByShop({
    product_shop,
    spu_id,
  }: {
    product_shop: string;
    spu_id: string;
  }) {
    if (!Types.ObjectId.isValid(product_shop) || !Types.ObjectId.isValid(spu_id)) {
      return null;
    }

    return await SpuModel.findOneAndUpdate(
      {
        _id: convertToObjectIdMongodb(spu_id),
        product_shop: convertToObjectIdMongodb(product_shop),
        isDeleted: false
      },
      { isDraft: true, isPublished: false },
      { new: true }
    ).lean();
  }

  static async updateSpuByProductId(product_id: string, payload: any) {
    return await SpuModel.findOneAndUpdate(
      { product_id },
      payload,
      { new: true }
    ).lean();
  }
}

export default SpuRepository;