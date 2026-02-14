import { cartRepository } from "../repositories/cart.repository.js";

export const cartService = {
  getCart(cid) {
    return cartRepository.getCart(cid);
  },
  createCart() {
    return cartRepository.createCart();
  },
  addProduct(cid, pid) {
    return cartRepository.addProduct(cid, pid);
  },
  updateProduct(cid, pid, quantity) {
    return cartRepository.updateProduct(cid, pid, quantity);
  },
  updateAllProducts(cid, products) {
    return cartRepository.updateAllProducts(cid, products);
  },
  deleteProduct(cid, pid) {
    return cartRepository.deleteProduct(cid, pid);
  },
  emptyCart(cid) {
    return cartRepository.emptyCart(cid);
  },
};
