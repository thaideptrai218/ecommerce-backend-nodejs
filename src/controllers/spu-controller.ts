import type { Request, Response } from "express";
import SpuService from "../services/spu-service";
import { Created, OK } from "../core/success-respone";
import { Types } from "mongoose";

class SpuController {
    static async createSpu(req: Request, res: Response) {
        const { userId } = req.user;
        const newSpu = await SpuService.createSpu({
            ...req.body,
            product_shop: new Types.ObjectId(userId)
        });
        return new Created("SPU created successfully!", newSpu).send(res);
    }

    static async findAllSpus(req: Request, res: Response) {
        const { limit, sort, page } = req.query;
        const spus = await SpuService.findAllSpus({
            limit: limit ? Number(limit) : undefined,
            sort: sort ? String(sort) : undefined,
            page: page ? Number(page) : undefined
        });
        return new OK("Get all SPUs successfully!", spus).send(res);
    }

    static async findSpu(req: Request, res: Response) {
        const { spu_id } = req.params;
        const spu = await SpuService.findSpuById(spu_id);
        return new OK("Get SPU successfully!", spu).send(res);
    }

    static async updateSpu(req: Request, res: Response) {
        const { spu_id } = req.params;
        const { userId } = req.user;
        const updatedSpu = await SpuService.updateSpu(spu_id, req.body, userId);
        return new OK("SPU updated successfully!", updatedSpu).send(res);
    }

    static async deleteSpu(req: Request, res: Response) {
        const { spu_id } = req.params;
        const { userId } = req.user;
        const deletedSpu = await SpuService.deleteSpu(spu_id, userId);
        return new OK("SPU deleted successfully!", deletedSpu).send(res);
    }

    static async publishSpu(req: Request, res: Response) {
        const { spu_id } = req.params;
        const { userId } = req.user;
        const publishedSpu = await SpuService.publishSpu(userId, spu_id);
        return new OK("SPU published successfully!", publishedSpu).send(res);
    }

    static async unpublishSpu(req: Request, res: Response) {
        const { spu_id } = req.params;
        const { userId } = req.user;
        const unpublishedSpu = await SpuService.unpublishSpu(userId, spu_id);
        return new OK("SPU unpublished successfully!", unpublishedSpu).send(res);
    }

    static async findAllDraftsForShop(req: Request, res: Response) {
        const { userId } = req.user;
        const { limit, sort, page } = req.query;
        const spus = await SpuService.findAllDraftsForShop(userId, {
            limit: limit ? Number(limit) : undefined,
            sort: sort ? String(sort) : undefined,
            page: page ? Number(page) : undefined
        });
        return new OK("Get all draft SPUs successfully!", spus).send(res);
    }

    static async findAllPublishedForShop(req: Request, res: Response) {
        const { userId } = req.user;
        const { limit, sort, page } = req.query;
        const spus = await SpuService.findAllPublishedForShop(userId, {
            limit: limit ? Number(limit) : undefined,
            sort: sort ? String(sort) : undefined,
            page: page ? Number(page) : undefined
        });
        return new OK("Get all published SPUs successfully!", spus).send(res);
    }
}

export default SpuController;
