import { productService } from "../services/product.service.js";
import { cartService } from "../services/cart.service.js";

export function getLogin(req, res) {
  if (res.locals.user) {
    return res.redirect("/");
  }
  res.render("login", {
    title: "Login",
    style: "index.css",
  });
}

export function getRegister(req, res) {
  if (res.locals.user) {
    return res.redirect("/");
  }
  res.render("register", {
    title: "Registro",
    style: "index.css",
  });
}

export function getHome(req, res) {
  res.render("home", {
    title: "Inicio",
    style: "index.css",
  });
}

export async function getProductsList(req, res) {
  const products = await productService.getAll(req.query);
  res.render("productsList", {
    title: "Productos",
    style: "index.css",
    products: JSON.parse(JSON.stringify(products.docs)),
    prevLink: {
      exist: !!products.prevLink,
      link: products.prevLink,
    },
    nextLink: {
      exist: !!products.nextLink,
      link: products.nextLink,
    },
  });
}

export async function getProductDetail(req, res) {
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
}

export async function getRealTimeProducts(req, res) {
  const products = await productService.getAll(req.query);
  res.render("realTimeProducts", {
    title: "Productos",
    style: "index.css",
    products: JSON.parse(JSON.stringify(products.docs)),
  });
}

export async function getCartDetail(req, res) {
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
      title: "Not Found",
      style: "index.css",
    });
  }
}
