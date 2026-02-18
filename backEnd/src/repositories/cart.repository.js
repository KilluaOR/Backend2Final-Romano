import { cartDAO } from "../dao/cartDBManager.js";
import { productRepository } from "./product.repository.js";

export const cartRepository = {
  getCart: async (cid) => {
    const cart = await cartDAO.findById(cid, true);
    if (!cart) throw new Error(`El carrito ${cid} no existe`);
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

  updateAllProducts: async (cid, products) => {
    for (const item of products) {
      await productRepository.getById(item.product);
    }
    const cart = await cartDAO.findById(cid);
    if (!cart) {
      throw new Error(`El carrito ${cid} no existe`);
    }
    return cartDAO.updateProducts(cid, products);
  },

  deleteProduct: async (cid, pid) => {
    await productRepository.getById(pid);
    const cart = await cartDAO.findById(cid);
    if (!cart) throw new Error(`El carrito ${cid} no existe`);

    const products = cart.products.filter(
      (item) => item.product.toString() !== pid,
    );
    return cartDAO.updateProducts(cid, products);
  },

  emptyCart: async (cid) => {
    const cart = await cartDAO.findById(cid);
    if (!cart) throw new Error(`El carrito ${cid} no existe`);

    return cartDAO.updateProducts(cid, []);
  },
};
// import { cartDAO } from "../dao/cartDBManager.js";
// import { productDAO } from "../dao/productDBManager.js"; // Importamos el DAO directamente
// import { ticketDAO } from "../dao/ticketDBManager.js"; // Lo necesitaremos para el ticket
// import { v4 as uuidv4 } from "uuid";

// export const cartRepository = {
//   // ... (getCart, createCart, addProduct, etc. se mantienen igual) ...

//   purchase: async (cid, userEmail) => {
//     // 1. Traemos el carrito con POPULATE (clave para ver los stocks)
//     const cart = await cartDAO.findById(cid, true);
//     if (!cart) throw new Error(`El carrito ${cid} no existe`);

//     const productsNoStock = [];
//     let totalAmount = 0;

//     // 2. Procesamos cada producto del carrito
//     for (const item of cart.products) {
//       const product = item.product; // Gracias al populate, esto es el objeto producto
//       const quantityRequested = item.quantity;

//       if (product.stock >= quantityRequested) {
//         // HAY STOCK: Restamos de la DB
//         await productDAO.update(product._id, { stock: product.stock - quantityRequested });
//         totalAmount += product.price * quantityRequested;
//       } else {
//         // NO HAY STOCK: Se guarda para que permanezca en el carrito
//         productsNoStock.push(item);
//       }
//     }

//     // 3. Generar Ticket si hubo ventas
//     let ticket = null;
//     if (totalAmount > 0) {
//       ticket = await ticketDAO.create({
//         code: uuidv4(),
//         purchase_datetime: new Date(),
//         amount: totalAmount,
//         purchaser: userEmail
//       });
//     }

//     // 4. Actualizamos el carrito: solo quedan los productos que NO se pudieron comprar
//     // Mongoose espera un array de objetos { product: ID, quantity: N }
//     const remainingProducts = productsNoStock.map(item => ({
//       product: item.product._id,
//       quantity: item.quantity
//     }));

//     await cartDAO.updateProducts(cid, remainingProducts);

//     return {
//       ticket,
//       unprocessedProducts: productsNoStock.map(item => item.product._id)
//     };
//   }
// };
