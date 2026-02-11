import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';

const productDAO = new productDBManager();
const cartDAO = new cartDBManager(productDAO);

/**
 * Repository de carritos. Usa el DAO de carrito (y producto).
 * La validación "solo el dueño del carrito" se aplica en rutas con requireUserCart.
 */
export const cartRepository = {
  async getCart(cid) {
    return cartDAO.getProductsFromCartByID(cid);
  },

  async createCart() {
    return cartDAO.createCart();
  },

  async addProduct(cid, pid) {
    return cartDAO.addProductByID(cid, pid);
  },

  async updateProduct(cid, pid, quantity) {
    return cartDAO.updateProductByID(cid, pid, quantity);
  },

  async updateAllProducts(cid, products) {
    return cartDAO.updateAllProducts(cid, products);
  },

  async deleteProduct(cid, pid) {
    return cartDAO.deleteProductByID(cid, pid);
  },

  async emptyCart(cid) {
    return cartDAO.deleteAllProducts(cid);
  },
};
