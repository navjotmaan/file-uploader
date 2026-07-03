import { createFolder, getAllFolders } from "../controllers/folderController.js";
import { Router } from "express";

const folderRouter = Router();

folderRouter.post('/new', createFolder);
folderRouter.get('/all', getAllFolders);

export { folderRouter };