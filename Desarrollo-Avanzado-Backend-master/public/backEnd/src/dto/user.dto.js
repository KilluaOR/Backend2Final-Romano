/**
 * DTO (Data Transfer Object) para el usuario actual.
 * Transforma el documento de usuario de la BD en un objeto seguro para la API:
 * solo campos que puede ver el cliente, sin password ni __v.
 *
 * @param {Object} userDoc - Documento de Mongoose (puede ser plain object o doc)
 * @returns {Object} { id, first_name, last_name, email, age, role, cart }
 */
export function toUserCurrentDTO(userDoc) {
  if (!userDoc) return null;
  return {
    id: userDoc._id?.toString?.() ?? userDoc.id,
    first_name: userDoc.first_name,
    last_name: userDoc.last_name,
    email: userDoc.email,
    age: userDoc.age,
    role: userDoc.role,
    cart: userDoc.cart?.toString?.() ?? userDoc.cart,
  };
}
