import { Router } from "express";
import passport from "passport";
import { uploader } from "../utils/multerUtil.js";

import {
  create,
  deleteProduct,
  getAll,
  getById,
  update,
} from "../controllers/product.controller.js";
import { requireAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router.get("/", getAll);

router.get("/:pid", getById);

//Solo si el usuario está logeado y es admin se ejecuta el upload y create.
router.post(
  "/",
  passport.authenticate("current", { session: false }),
  requireAdmin,
  uploader.array("thumbnails", 3),
  create,
);

router.put(
  "/:pid",
  passport.authenticate("current", { session: false }),
  requireAdmin,
  uploader.array("thumbnails", 3),
  update,
);

router.delete(
  "/:pid",
  passport.authenticate("current", { session: false }),
  requireAdmin,
  deleteProduct,
);

export default router;
