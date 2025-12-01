import { BadRequestError } from "../core/error-respone";
import { SuccessResponse } from "../core/success-respone";
import {
    uploadImageFromLocal,
    uploadImageFromUrl,
    uploadImagesFromLocalFiles,
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
            await uploadImageFromLocal({ path: file.path })
        ).send(res);
    };
    uploadImageFromLocalFiles = async (req, res, next) => {
        const { files } = req;

        if (!files) {
            throw new BadRequestError("FIle missing");
        }

        new SuccessResponse(
            "Upload sucessfully",
            200,
            await uploadImagesFromLocalFiles({
                files,
            })
        ).send(res);
    };
}

export default new UploadController();
