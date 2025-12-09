import { SuccessResponse } from "../core/success-respone";

const profiles = [
    {
        user_id: 1,
        user_name: "CR7",
        user_avt: "image.com/user/1",
    },
    {
        user_id: 2,
        user_name: "M10",
        user_avt: "image.com/user/2",
    },
    {
        user_id: 3,
        user_name: "tipsjs",
        user_avt: "image.com/user/3",
    },
];

class ProfileController {
    profiles = async (req, res, next) => {
        new SuccessResponse("view all profile", 200, profiles).send(res);
    };

    profile = async (req, res, next) => {
        new SuccessResponse("view One profile", 200, {
            user_id: 2,
            user_name: "M10",
            user_avt: "image.com/user/2",
        }).send(res);
    };
}

export default new ProfileController();
