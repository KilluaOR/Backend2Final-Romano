import { productDAO } from "../dao/productDBManager.js";

export const productRepository = {
  async getAll(params) {
    const page = params?.page ? parseInt(params.page) : 1;
    const limit = params?.limit ? parseInt(params.limit) : 10;
    const options = { page, limit };
    if (params?.sort === "asc" || params?.sort === "desc") {
      options.sort = { price: params.sort };
    }

    let filter = {};
    if (params?.query) {
      const q = params.query;
      if (q === "true" || q === "false") {
        filter.status = q === "true";
      } else {
        filter.category = q;
      }
    }

    const result = await productDAO.findPaginated(filter, options);

    result.prevLink = result.hasPrevPage
      ? `/products?page=${result.prevPage}`
      : null;
    result.nextLink = result.hasNextPage
      ? `/products?page=${result.nextPage}`
      : null;
    if (limit !== 10) {
      if (result.prevLink) result.prevLink += `&limit=${limit}`;
      if (result.nextLink) result.nextLink += `&limit=${limit}`;
    }
    if (params?.sort) {
      if (result.prevLink) result.prevLink += `&sort=${params.sort}`;
      if (result.nextLink) result.nextLink += `&sort=${params.sort}`;
    }

    return result;
  },

  async getById(pid) {
    const product = await productDAO.findById(pid);
    if (!product) {
      throw new Error(`El producto ${pid} no existe`);
    }
    return product;
  },

  async create(productData) {
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
    return productDAO.create({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails: thumbnails ?? [],
      status: status ?? true,
    });
  },

  async update(pid, productUpdate) {
    const product = await productDAO.findById(pid);
    if (!product) {
      throw new Error(`El producto ${pid} no existe`);
    }
    await productDAO.update(pid, productUpdate);
    return productDAO.findById(pid);
  },

  async delete(pid) {
    const result = await productDAO.delete(pid);
    if (result.deletedCount === 0) {
      throw new Error(`El producto ${pid} no existe`);
    }
    return result;
  },
};
