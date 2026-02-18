import { cartRepository } from "../repositories/cart.repository.js";

export const cartService = {
  getCart: (cid) => cartRepository.getCart(cid),
  createCart: () => cartRepository.createCart(),
  addProduct: (cid, pid) => cartRepository.addProduct(cid, pid),
  updateProduct: (cid, pid, quantity) =>
    cartRepository.updateProduct(cid, pid, quantity),
  updateAllProducts: (cid, products) =>
    cartRepository.updateAllProducts(cid, products),
  deleteProduct: (cid, pid) => cartRepository.deleteProduct(cid, pid),
  emptyCart: (cid) => cartRepository.emptyCart(cid),
};
