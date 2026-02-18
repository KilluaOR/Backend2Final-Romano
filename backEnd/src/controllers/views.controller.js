import { productService } from "../services/product.service.js";
import { cartService } from "../services/cart.service.js";

export const getLogin = (req, res) => {
  if (res.locals.user) {
    return res.redirect("/");
  }
  res.render("login", {
    title: "Login",
    style: "index.css",
  });
};

export const getRegister = (req, res) => {
  if (res.locals.user) {
    return res.redirect("/");
  }
  res.render("register", {
    title: "Registro",
    style: "index.css",
  });
};

export const getHome = (req, res) => {
  res.render("home", {
    title: "Inicio",
    style: "index.css",
  });
};

export const getProductsList = async (req, res) => {
  try {
    const products = await productService.getAll(req.query);
    res.render("productsList", {
      title: "Productos",
      style: "index.css",
      products: JSON.parse(JSON.stringify(products.docs)),
      prevLink: products.prevLink,
      nextLink: products.nextLink,
      user: res.locals.user,
    });
  } catch (error) {
    res.status(500).render("error", { message: "Error al cargar productos" });
  }
};

export const getProductDetail = async (req, res) => {
  try {
    const product = await productService.getById(req.params.pid);
    res.render("productDetail", {
      title: "Detalle de producto",
      style: "index.css",
      product: JSON.parse(JSON.stringify(product)),
    });
  } catch (error) {
    res.status(404).render("notFound", {
      title: "Not Found",
      style: "index.css",
    });
  }
};

export const getRealTimeProducts = async (req, res) => {
  const products = await productService.getAll(req.query);
  res.render("realTimeProducts", {
    title: "Productos",
    style: "index.css",
    products: JSON.parse(JSON.stringify(products.docs)),
  });
};

export const getCartDetail = async (req, res) => {
  try {
    const response = await cartService.getCart(req.params.cid);
    res.render("cartDetail", {
      title: "Carrito",
      style: "index.css",
      cid: req.params.cid,
      products: JSON.parse(JSON.stringify(response.products)),
    });
  } catch (error) {
    res.status(404).render("notFound", {
      title: "Carrito no encontrado",
      style: "index.css",
    });
  }
};

export const getCheckoutSuccess = (req, res) => {
  res.render("checkout", { title: "Compra Exitosa", style: "index.css" });
};
