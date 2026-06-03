import { createFolder, getAllFolders } from "../controllers/folderController";
import { Router } from "express";

const folderRouter = Router();

folderRouter.post('/new', createFolder);
folderRouter.get('/all', getAllFolders);

export { folderRouter };