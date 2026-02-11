import { Router } from "express";
import passport from "passport";
import { requireAdmin } from "../middlewares/authorization.middleware.js";
import { getAll, getById, update, deleteUser } from "../controllers/user.controller.js";

const router = Router();
const requireJwt = passport.authenticate("jwt", { session: false });

router.get("/", requireJwt, requireAdmin, getAll);
router.get("/:uid", requireJwt, getById);
router.put("/:uid", requireJwt, update);
router.delete("/:uid", requireJwt, requireAdmin, deleteUser);

export default router;
