import { ticketModel } from "./models/ticket.model.js";

export const ticketDAO = {
  create: async (data) => {
    try {
      return await ticketModel.create(data);
    } catch (error) {
      throw new Error(`Error al crear el ticket en DB: ${error.message}`);
    }
  },

  findById: async (id) => {
    try {
      return await ticketModel.findById(id).lean();
    } catch (error) {
      throw new Error(`Error al buscar el ticket en DB: ${error.message}`);
    }
  },
};
