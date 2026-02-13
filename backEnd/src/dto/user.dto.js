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
