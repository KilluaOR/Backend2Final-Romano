import { Router } from "express";
import { productRepository } from "../repositories/product.repository.js";
import { uploader } from "../utils/multerUtil.js";

import {
  create,
  deleteProduct,
  getAll,
  getById,
  update,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getAll);

router.get("/:pid", getById);

router.post("/", uploader.array("thumbnails", 3), create);

router.put("/:pid", uploader.array("thumbnails", 3), update);

router.delete("/:pid", deleteProduct);

export default router;
