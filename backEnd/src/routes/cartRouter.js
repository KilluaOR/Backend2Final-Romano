import { Router } from "express";
import passport from "passport";
import { requireUserCart } from "../middlewares/authorization.middleware.js";
import {
  addProductByID,
  createCart,
  deleteAllProducts,
  deleteProductByID,
  getProductsFromCartByID,
  updateAllProducts,
  updateProductByID,
} from "../controllers/cart.controller.js";

const router = Router();

router.get(
  "/:cid",
  passport.authenticate("current", { session: false }),
  requireUserCart,
  getProductsFromCartByID,
);

router.post("/", createCart);

router.post(
  "/:cid/products/:pid",
  passport.authenticate("current", { session: false }),
  requireUserCart,
  addProductByID,
);

router.delete(
  "/:cid/products/:pid",
  passport.authenticate("current", { session: false }),
  requireUserCart,
  deleteProductByID,
);

router.put(
  "/:cid",
  passport.authenticate("current", { session: false }),
  requireUserCart,
  updateAllProducts,
);

router.put(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  requireUserCart,
  updateProductByID,
);

router.delete(
  "/:cid",
  passport.authenticate("current", { session: false }),
  requireUserCart,
  deleteAllProducts,
);

export default router;
