import notificationModel from "../models/notification-model";

export class NotificationService {
    static async pushNotiToSystem({
        type = "SHOP-001",
        receivedId = 1,
        senderId = 1,
        options = {},
    }: {
        type?: string;
        receivedId?: string | number;
        senderId?: string | number;
        options?: Record<string, any>;
    }) {
        try {
            let noti_content;

            if (type === "SHOP-001") {
                noti_content = `${
                    options.shopName || "Shop"
                } just added a product: ${
                    options.productName || "New Product"
                }`;
            } else if (type === "PROMOTION-001") {
                noti_content = `${
                    options.shopName || "Shop"
                } just added a voucher: ${
                    options.voucherName || "New Voucher"
                }`;
            } else if (type === "ORDER-001") {
                noti_content = `New order received: ${options.orderId}`;
            } else if (type === "ORDER-002") {
                noti_content = `Order status updated: ${options.orderId}`;
            } else if (type === "PROMOTION-002") {
                noti_content = `New promotion available: ${options.promotionName}`;
            } else {
                noti_content = `System notification`;
            }

            const newNoti = await notificationModel.create({
                noti_type: type,
                noti_content: noti_content,
                noti_senderId: senderId,
                noti_recivedId: receivedId,
                noti_options: options,
            });

            return newNoti;
        } catch (error) {
            console.error("Notification creation failed:", error);
            throw error;
        }
    }

    static async pushNotiToSystemAsync({
        type = "SHOP-001",
        receivedId = 1,
        senderId = 1,
        options = {},
    }: {
        type?: string;
        receivedId?: string | number;
        senderId?: string | number;
        options?: Record<string, any>;
    }) {
        // Fire and forget - don't wait for notification creation
        setImmediate(async () => {
            try {
                await this.pushNotiToSystem({
                    type,
                    receivedId,
                    senderId,
                    options,
                });
            } catch (error) {
                console.error("Async notification failed:", error);
            }
        });
    }

    static listNotiByUser = async ({
        userId = 1,
        type = "ALL",
        isRead = 0,
    }) => {
        const match = { noti_recivedId: userId };

        if (type != "ALL") {
            match.noti_type = type;
        }

        return await notificationModel.aggregate([
            { $match: match },
            {
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receivedId: 1,
                    noti_content: 1,
                    createAt: 1,
                },
            },
        ]);
    };
}
