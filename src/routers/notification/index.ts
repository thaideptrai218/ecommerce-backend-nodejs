import express from "express";
import notificationController from "../../controllers/notification-controller";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication } from "../../auth/check-auth";

const router = express.Router();

// Apply authentication middleware to all notification routes
router.use(authentication);

// Get user notifications
router.get(
    "/",
    asyncHandler(notificationController.listNotifications)
);

// Create notification (admin/system use)
router.post(
    "/",
    asyncHandler(notificationController.createNotification)
);

// Mark notification as read
router.patch(
    "/:notificationId/read",
    asyncHandler(notificationController.markAsRead)
);

export default router;