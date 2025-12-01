import { BadRequestError } from "../core/error-respone";
import { SuccessResponse } from "../core/success-respone";
import {
    uploadImageFromLocal,
    uploadImageFromUrl,
} from "../services/upload-service";

class UploadController {
    uploadFile = async (req, res, next) => {
        new SuccessResponse(
            "Upload sucessfully",
            200,
            await uploadImageFromUrl()
        ).send(res);
    };
    vsuploadFileThumb = async (req, res, next) => {
        const { file } = req;

        if (!file) {
            throw new BadRequestError("FIle missing");
        }

        new SuccessResponse(
            "Upload sucessfully",
            200,
            await uploadImageFromLocal({path: file.path})
        ).send(res);
    };
}

export default new UploadController();
