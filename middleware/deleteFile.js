import path from "path";
import { unlink } from "fs/promises";

export const deleteFile = async (file) => {
  const rootPath = process.cwd();
  const filePath = path.join(rootPath, "uploads", file);
  unlink(filePath, (err) => {
    if (err) return err.message || "error couurs while deleting file";
    return `File ${filePath}  has been deleted`;
  });
};
