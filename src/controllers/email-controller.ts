import { SuccessResponse } from "../core/success-respone";
import { newTemplate } from "../services/template-service";
import { sendEmailToken } from "../services/email-service";

class EmailController {
    newTemplate = async (req, res, next) => {
        new SuccessResponse("new template", await newTemplate(req.body)).send(
            res
        );
    };

    sendEmailToken = async (req, res, next) => {
        new SuccessResponse(
            "Send email token",
            201,
            await sendEmailToken(req.body)
        ).send(res);
    };
}

export default new EmailController();
