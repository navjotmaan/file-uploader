import { createFile, getAllFiles } from "../controllers/fileController";
import { Router } from "express";

const fileRouter = Router();

fileRouter.post('/:id/new', createFile);
fileRouter.get('/:id/all', getAllFiles);

export { fileRouter };