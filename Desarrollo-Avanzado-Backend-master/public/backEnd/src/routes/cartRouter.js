import { Router } from "express";
// import { productDBManager } from "../dao/productDBManager.js";
// import { cartDBManager } from "../dao/cartDBManager.js";
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
// const ProductService = new productDBManager();
// const CartService = new cartDBManager(ProductService);

router.get("/:cid", getProductsFromCartByID);

router.post("/", createCart);

router.post("/:cid/products/:pid", addProductByID);

router.delete("/:cid/products/:pid", deleteProductByID);

router.put("/:cid", updateAllProducts);

router.put("/:cid/product/:pid", updateProductByID);

router.delete("/:cid", deleteAllProducts);

export default router;
