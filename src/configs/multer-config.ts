import multer from "multer";

const uploadMem = multer({
    storage: multer.memoryStorage(),
});

const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./src/uploads/");
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
});

export { uploadMem, uploadDisk };
