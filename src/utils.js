import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/img')
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const originName = file.originalname;
        const extension = originName.split('.').pop();
        const filename = `${timestamp}-clase8.${extension}`;
        cb(null, filename);
    }

});

export const uploader = multer({ storage });