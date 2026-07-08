import { uploadFileController, getAllFiles, deleteFile } from "../controllers/fileController.js";
import { Router } from "express";

import multer from 'multer';

const fileRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Optional: Limit file size to 5MB
  }
});

fileRouter.post('/:id/new', upload.single('file'), uploadFileController);
fileRouter.get('/:id/all', getAllFiles);
fileRouter.delete('/delete', deleteFile);

export { fileRouter };