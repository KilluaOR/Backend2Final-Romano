import { cartDAO } from "../dao/cartDBManager.js";
import { productDAO } from "../dao/productDBManager.js";
import { ticketDAO } from "../dao/ticketDBManager.js";
import { mailingService } from "../services/mailing.service.js";
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

  purchase: async (cid, userEmail) => {
    const cart = await cartDAO.findById(cid, true);
    if (!cart) throw new Error("Carrito no encontrado");

    const failedProducts = [];
    const successfulProducts = [];
    let totalAmount = 0;

    // --- CAMBIO AQUÍ: Filtrar productos que podrían ser null ---
    const validProducts = cart.products.filter((item) => item.product !== null);

    for (const item of validProducts) {
      // Usamos validProducts en vez de cart.products
      const productDB = await productDAO.findById(item.product._id);

      if (productDB && productDB.stock >= item.quantity) {
        productDB.stock -= item.quantity;
        await productDAO.update(productDB._id, { stock: productDB.stock });

        const subtotal = productDB.price * item.quantity;
        totalAmount += subtotal;

        successfulProducts.push({
          title: productDB.title,
          quantity: item.quantity,
          price: productDB.price,
          subtotal: subtotal,
        });
      } else {
        failedProducts.push({
          product: item.product._id,
          quantity: item.quantity,
        });
      }
    }

    let ticket = null;
    if (successfulProducts.length > 0) {
      ticket = await ticketDAO.create({
        code: Math.random().toString(36).substring(2, 9).toUpperCase(),
        amount: totalAmount,
        purchaser: userEmail,
      });

      const productosHTML = successfulProducts
        .map((p) => `<li>${p.title} x ${p.quantity} - $${p.subtotal}</li>`)
        .join("");

      // --- CAMBIO AQUÍ: Try/Catch para el mail ---
      try {
        await mailingService.sendMail({
          to: userEmail,
          subject: "Confirmación de compra - Killu Store",
          html: `<h1>¡Gracias por tu compra!</h1>...`, // (Tu código de HTML igual)
        });
      } catch (mailError) {
        console.error(
          "No se pudo enviar el mail, pero la compra se procesó:",
          mailError.message,
        );
        // No lanzamos error para que la compra siga exitosa
      }
    } else {
      throw new Error("No hay stock suficiente para procesar la compra.");
    }

    await cartDAO.updateProducts(cid, failedProducts);

    return {
      ticket,
      unprocessedProducts: failedProducts.map((p) => p.product),
    };
  },
};
