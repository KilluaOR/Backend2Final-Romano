import { cartService } from "../services/cart.service.js";

export const getProductsFromCartByID = async (req, res) => {
  try {
    const result = await cartService.getCart(req.params.cid);
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

export const createCart = async (req, res) => {
  try {
    const result = await cartService.createCart();
    res.status(201).send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

export const addProductByID = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await cartService.addProduct(cid, pid);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
};

export const deleteProductByID = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await cartService.deleteProduct(cid, pid);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
};

export const updateAllProducts = async (req, res) => {
  try {
    const result = await cartService.updateAllProducts(
      req.params.cid,
      req.body.products,
    );
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

export const updateProductByID = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await cartService.updateProduct(cid, pid, quantity);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    const result = await cartService.emptyCart(req.params.cid);
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

export const purchase = async (req, res) => {
  try {
    const { cid } = req.params;

    const result = await cartService.purchase(cid, req.user.email);

    res.send({ status: "success", payload: result });
  } catch (error) {
    console.error("❌ ERROR EN PURCHASE:", error);
    res.status(500).send({ status: "error", message: error.message });
  }
};
