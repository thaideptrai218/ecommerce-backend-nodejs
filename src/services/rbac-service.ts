import resourceModel from "../models/resource-model";
import roleModel from "../models/role-model";

/**
 * new resource
 * @thaideptrai218
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */
export const createResource = async ({
    name = "profile",
    slug = "p0001",
    description = "",
}) => {
    try {
        //1. Check name or slug exists

        //2. New resource
        const resource = await resourceModel.create({
            src_name: name,
            src_desc: description,
            src_slug: slug,
        });

        return resource;
    } catch (error) {
        return error;
    }
};

export const resourceList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = "",
}) => {
    try {
        //1. Check admin from middleware function

        //2. get list of resource
        const resource = await resourceModel.aggregate([
            {
                $project: {
                    name: "$src_name",
                    slug: "$src_slug",
                    description: "$src_description",
                    resourceId: "$_id",
                    createdAt: 1,
                },
            },
        ]);

        return resource;
    } catch (error) {
        return [];
    }
};

export const createRole = async ({
    name = "shop",
    slug = "s0001",
    description = "extend from shop or user",
    grants = [],
}) => {
    try {
        //1. Check role exists

        //2. New role.
        const role = await roleModel.create({
            role_name: name,
            role_desc: description,
            role_grants: grants,
            role_slug: slug,
        });

        return role;
    } catch (error) {
        return error;
    }
};

export const roleList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = "",
}) => {
    try {
        const roles = await roleModel.aggregate([
            {
                $unwind: "$role_grants",
            },
            {
                $lookup: {
                    from: "resources",
                    localField: "role_grants.resource",
                    foreignField: "_id",
                    as: "resource",
                },
            },
            {
                $unwind: "$resource",
            },
            {
                $project: {
                    role: "$role_name",
                    resource: "$resource.src_name",
                    action: "$role_grants.actions",
                    attributes: "$role_grants.attributes",
                },
            },
            {
                $unwind: "$action",
            },
            {
                $project: {
                    _id: 0,
                    role: 1,
                    resource: 1,
                    action: 1,
                    attributes: 1,
                },
            },
        ]);

        return roles;
    } catch (error) {
        return error;
    }
};
