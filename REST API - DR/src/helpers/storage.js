import multer from 'multer';

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const mimeType = file.mimetype.split('/');
        const fileName = `${file.originalname}`;
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

export const storage = multer({ storage: diskStorage, fileFilter: fileFilter }).single(
    'image'
)