import { Router } from "express";
import passport from "passport";
import { requireAdmin } from "../middlewares/authorization.middleware.js";
import { uploader } from "../utils/multerUtil.js";
import {
  getAll,
  getById,
  create,
  update,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = Router();
const authenticate = passport.authenticate("jwt", { session: false });

router.get("/", getAll);

router.get("/:pid", getById);

router.post(
  "/",
  authenticate,
  requireAdmin,
  uploader.array("thumbnails"),
  create,
);
router.put(
  "/:pid",
  authenticate,
  requireAdmin,
  uploader.array("thumbnails"),
  update,
);
router.delete("/:pid", authenticate, requireAdmin, deleteProduct);

export default router;
