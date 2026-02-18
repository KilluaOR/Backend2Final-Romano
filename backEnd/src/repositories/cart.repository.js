import { cartDAO } from "../dao/cartDBManager.js";
import { productDAO } from "../dao/productDBManager.js"; // REQUISITO: DAO para peticiones asíncronas
import { ticketDAO } from "../dao/ticketDBManager.js"; // REQUISITO: Tickets en repository
import { productRepository } from "./product.repository.js";
import { v4 as uuidv4 } from "uuid";

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
    if (!cart) throw new Error(`El carrito ${cid} no existe`);

    const idx = cart.products.findIndex(
      (item) => item.product.toString() === pid,
    );
    if (idx < 0)
      throw new Error(`El producto ${pid} no está en el carrito ${cid}`);

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
    if (!cart) throw new Error(`El carrito ${cid} no existe`);
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

  // --- NUEVO MÉTODO PURCHASE (Cumpliendo criterios del profesor) ---
  purchase: async (cid, userEmail) => {
    const cart = await cartDAO.findById(cid, true); // Populate para ver el stock
    if (!cart) throw new Error("Carrito no encontrado");

    const failedProducts = [];
    let totalAmount = 0;

    // REQUISITO: Usar for...of (asíncrono) en lugar de forEach
    for (const item of cart.products) {
      const productDB = await productDAO.findById(item.product._id); // Petición asíncrona vía DAO

      if (productDB && productDB.stock >= item.quantity) {
        // Si hay stock, restamos
        productDB.stock -= item.quantity;
        await productDAO.update(productDB._id, { stock: productDB.stock });
        totalAmount += productDB.price * item.quantity;
      } else {
        // REQUISITO: Si no hay stock, el ID debe quedar para el carrito
        failedProducts.push({
          product: item.product._id,
          quantity: item.quantity,
        });
      }
    }

    let ticket = null;
    if (totalAmount > 0) {
      // REQUISITO: Creación de ticket en Repository
      ticket = await ticketDAO.create({
        code: uuidv4(),
        amount: totalAmount,
        purchaser: userEmail,
      });
    }

    // REQUISITO: El carrito se actualiza con lo que NO se pudo comprar
    await cartDAO.updateProducts(cid, failedProducts);

    return {
      ticket,
      unprocessedProducts: failedProducts.map((p) => p.product),
    };
  },
};

// import { cartDAO } from "../dao/cartDBManager.js";
// import { ProductDAO } from "../dao/productDBManager.js";
// // import { ticketDAO }
// import { productRepository } from "./product.repository.js";

// export const cartRepository = {
//   getCart: async (cid) => {
//     const cart = await cartDAO.findById(cid, true);
//     if (!cart) throw new Error(`El carrito ${cid} no existe`);
//     return cart;
//   },

//   createCart: async () => cartDAO.create(),

//   addProduct: async (cid, pid) => {
//     await productRepository.getById(pid);
//     const cart = await cartDAO.findById(cid);
//     if (!cart) throw new Error(`El carrito ${cid} no existe`);
//     const products = [...cart.products];
//     const idx = products.findIndex((item) => item.product.toString() === pid);
//     idx >= 0
//       ? (products[idx].quantity += 1)
//       : products.push({ product: pid, quantity: 1 });

//     return cartDAO.updateProducts(cid, products);
//   },

//   updateProduct: async (cid, pid, quantity) => {
//     const qty = parseInt(quantity, 10);
//     if (isNaN(qty) || qty < 1)
//       throw new Error("La cantidad ingresada no es válida");
//     await productRepository.getById(pid);
//     const cart = await cartDAO.findById(cid);
//     if (!cart) {
//       throw new Error(`El carrito ${cid} no existe`);
//     }
//     const idx = cart.products.findIndex(
//       (item) => item.product.toString() === pid,
//     );
//     if (idx < 0) {
//       throw new Error(`El producto ${pid} no está en el carrito ${cid}`);
//     }
//     const products = cart.products.map((item, i) => ({
//       product: item.product,
//       quantity: i === idx ? qty : item.quantity,
//     }));
//     return cartDAO.updateProducts(cid, products);
//   },

//   updateAllProducts: async (cid, products) => {
//     for (const item of products) {
//       await productRepository.getById(item.product);
//     }
//     const cart = await cartDAO.findById(cid);
//     if (!cart) {
//       throw new Error(`El carrito ${cid} no existe`);
//     }
//     return cartDAO.updateProducts(cid, products);
//   },

//   deleteProduct: async (cid, pid) => {
//     await productRepository.getById(pid);
//     const cart = await cartDAO.findById(cid);
//     if (!cart) throw new Error(`El carrito ${cid} no existe`);

//     const products = cart.products.filter(
//       (item) => item.product.toString() !== pid,
//     );
//     return cartDAO.updateProducts(cid, products);
//   },

//   emptyCart: async (cid) => {
//     const cart = await cartDAO.findById(cid);
//     if (!cart) throw new Error(`El carrito ${cid} no existe`);

//     return cartDAO.updateProducts(cid, []);
//   },
// };
