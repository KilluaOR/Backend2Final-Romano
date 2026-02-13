export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(403)
        .json({ status: "error", message: "No autorizado" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "No tiene el rol necesario para esta acción",
      });
    }
    next();
  };
}

export const requireAdmin = requireRole(ROLES.ADMIN);

export const requireUser = requireRole(ROLES.USER);

//   Verifica que el carrito solicitado (:cid) sea el del usuario autenticado.

export const requireUserCart = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ status: "error", message: "No autorizado" });
  }
  if (String(req.params.cid) !== String(req.user.cart)) {
    return res.status(403).json({
      status: "error",
      message: "No puede modificar el carrito de otro usuario",
    });
  }
  next();
};
