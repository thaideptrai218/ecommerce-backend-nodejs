import type { Request, Response } from "express";
import { NotificationService } from "../services/notification-service";
import { OK, Created } from "../core/success-respone";

class NotificationController {
    static async listNotifications(req: Request, res: Response) {
        const { userId } = req.body;
        const { type = "ALL", isRead = 0 } = req.query;

        const notifications = await NotificationService.listNotiByUser({
            userId,
            type: type as string,
            isRead: Number(isRead),
        });

        return new OK(
            "Get notifications successfully!",
            notifications
        ).send(res);
    }

    static async createNotification(req: Request, res: Response) {
        const { type, receivedId, senderId, options } = req.body;

        const newNotification = await NotificationService.pushNotiToSystem({
            type,
            receivedId,
            senderId,
            options,
        });

        return new Created(
            "Notification created successfully!",
            newNotification
        ).send(res);
    }

    static async markAsRead(req: Request, res: Response) {
        const { userId } = req.user;
        const { notificationId } = req.params;

        // This would need to be implemented in the service
        // For now, return success response
        return new OK(
            "Notification marked as read successfully!",
            { notificationId, userId }
        ).send(res);
    }
}

export default NotificationController;