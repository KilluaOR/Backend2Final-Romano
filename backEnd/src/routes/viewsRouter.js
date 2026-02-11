import { Router } from "express";
import {
  getLogin,
  getRegister,
  getHome,
  getProductsList,
  getProductDetail,
  getRealTimeProducts,
  getCartDetail,
} from "../controllers/views.controller.js";

const router = Router();

const requireAuth = (req, res, next) => {
  if (!res.locals.user) {
    return res.redirect("/login");
  }
  next();
};

router.get("/login", getLogin);
router.get("/register", getRegister);

router.get("/", requireAuth, getHome);
router.get("/products", requireAuth, getProductsList);
router.get("/products/:pid", requireAuth, getProductDetail);
router.get("/realtimeproducts", requireAuth, getRealTimeProducts);
router.get("/cart/:cid", requireAuth, getCartDetail);
router.get("/carts/:cid", requireAuth, getCartDetail);

export default router;
