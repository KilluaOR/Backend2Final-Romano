import { productDAO } from "../dao/productDBManager.js";

export const productRepository = {
  getAll: async (params) => {
    const page = params?.page ? parseInt(params.page) : 1;
    const limit = params?.limit ? parseInt(params.limit) : 10;
    const options = { page, limit, lean: true };
    if (params?.sort === "asc" || params?.sort === "desc") {
      options.sort = { price: params.sort };
    }

    let filter = {};
    if (params?.query) {
      const q = params.query;
      q === "true" || q === "false"
        ? (filter.status = q === "true")
        : (filter.category = q);
    }

    const result = await productDAO.findPaginated(filter, options);

    const baseUrl = `/products?limit=${limit}${params?.sort ? `&sort=${params.sort}` : ""}`;
    result.prevLink = result.hasPrevPage
      ? `${baseUrl}&page=${result.prevPage}`
      : null;
    result.nextLink = result.hasNextPage
      ? `${baseUrl}&page=${result.nextPage}`
      : null;

    return result;
  },

  getById: async (pid) => {
    const product = await productDAO.findById(pid);
    if (!product) throw new Error(`El producto ${pid} no existe`);
    return product;
  },

  create: async (productData) => {
    const {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
      status,
    } = productData;
    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Faltan campos requeridos para crear el producto");
    }
    return productDAO.create(productData);
  },

  update: async (pid, productUpdate) => {
    const exists = await productDAO.findById(pid);
    if (!exists) throw new Error(`El producto ${pid} no existe`);
    await productDAO.update(pid, productUpdate);
    return productDAO.findById(pid);
  },

  delete: async (pid) => {
    const result = await productDAO.delete(pid);
    if (result.deletedCount === 0)
      throw new Error(`El producto ${pid} no existe`);
    return result;
  },
};
