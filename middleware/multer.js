import multer from "multer";
import fs from "fs";

const getFilePath = (fiels) => {
  switch (fiels) {
    case "mainImgaeLink":
      return "uploads/mainImage";
    case "smallImage":
      return "uploads/smallImage";
    default:
      return "uploads/";
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = getFilePath(file.fieldname);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

export const upload = multer({ storage: storage }).fields([
  { name: "mainImgaeLink", maxCount: 1 },
  { name: "smallImage", maxCount: 20 },
]);
