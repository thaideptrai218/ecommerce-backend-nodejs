import { SuccessResponse } from "../core/success-respone";
import { checkLoginEmailTokenService, newUser } from "../services/user-service";

class UserController {
    newUser = async (req, res, next) => {
        const response = await newUser(req.body);
        new SuccessResponse(
            "otp email for user sucessfuly",
            201,
            response
        ).send(res);
    };

    checkRegisterEmailToken = async (req, res, next) => {
        const { token } = req.query;
        console.log("===============", token, "===================");
        const response = await checkLoginEmailTokenService({ token });
        new SuccessResponse("User registered successfully", 201, response).send(
            res
        );
    };
}

export default new UserController();
