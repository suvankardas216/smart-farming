// import multer from "multer";
// import path from "path";

// // Storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); // make sure this folder exists
//     },
//     filename: (req, file, cb) => {
//         cb(
//             null,
//             file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//         );
//     },
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb("Error: Images Only!");
//     }
// };

// const upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//     fileFilter,
// });

// export default upload;


import multer from "multer";

// Memory storage 
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = file.originalname.match(/\.(jpeg|jpg|png)$/i);
    const mimetype = file.mimetype.startsWith("image/");

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Error: Only images are allowed"));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
});

export default upload;
