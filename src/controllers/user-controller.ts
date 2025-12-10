import { SuccessResponse } from "../core/success-respone";
import { newUser } from "../services/user-service";

class UserController {
    newUser = async (req, res, next) => {
        const response = await newUser(req.body);
        new SuccessResponse(
            "otp email for user sucessfuly",
            201,
            response
        ).send(res);
    };

    checkRegisterEmailToken = async () => {};
}

export default new UserController();
