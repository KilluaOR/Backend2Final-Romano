import { cartDAO } from "../dao/cartDBManager.js";
import { productRepository } from "./product.repository.js";

export const cartRepository = {
  getCart: async (cid) => {
    const cart = await cartDAO.findById(cid, true);
    if (!cart) {
      throw new Error(`El carrito ${cid} no existe`);
    }
    return cart;
  },

  createCart: async () => cartDAO.create(),

  addProduct: async (cid, pid) => {
    await productRepository.getById(pid);
    const cart = await cartDAO.findById(cid);
    if (!cart) throw new Error(`El carrito ${cid} no existe`);
    const products = [...cart.products];
    const idx = products.findIndex((item) => item.product.toString() === pid);
    idx >= 0
      ? (products[idx].quantity += 1)
      : products.push({ product: pid, quantity: 1 });

    return cartDAO.updateProducts(cid, products);
  },

  updateProduct: async (cid, pid, quantity) => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1)
      throw new Error("La cantidad ingresada no es válida");
    await productRepository.getById(pid);
    const cart = await cartDAO.findById(cid);
    if (!cart) {
      throw new Error(`El carrito ${cid} no existe`);
    }
    const idx = cart.products.findIndex(
      (item) => item.product.toString() === pid,
    );
    if (idx < 0) {
      throw new Error(`El producto ${pid} no está en el carrito ${cid}`);
    }
    const products = cart.products.map((item, i) => ({
      product: item.product,
      quantity: i === idx ? qty : item.quantity,
    }));
    return cartDAO.updateProducts(cid, products);
  },

  async updateAllProducts(cid, products) {
    for (const item of products) {
      await productRepository.getById(item.product);
    }
    const cart = await cartDAO.findById(cid);
    if (!cart) {
      throw new Error(`El carrito ${cid} no existe`);
    }
    return cartDAO.updateProducts(cid, products);
  },

  async deleteProduct(cid, pid) {
    await productRepository.getById(pid);
    const cart = await cartDAO.findById(cid);
    if (!cart) {
      throw new Error(`El carrito ${cid} no existe`);
    }
    const products = cart.products.filter(
      (item) => item.product.toString() !== pid,
    );
    return cartDAO.updateProducts(cid, products);
  },

  async emptyCart(cid) {
    const cart = await cartDAO.findById(cid);
    if (!cart) {
      throw new Error(`El carrito ${cid} no existe`);
    }
    return cartDAO.updateProducts(cid, []);
  },
};
