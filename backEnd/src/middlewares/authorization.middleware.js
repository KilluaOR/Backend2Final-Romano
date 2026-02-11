export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ status: "error", message: "No autorizado" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Solo administradores pueden realizar esta acción",
    });
  }
  next();
};

export const requireUserCart = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ status: "error", message: "No autorizado" });
  }
  if (String(req.params.cid) !== String(req.user.cart)) {
    return res
      .status(403)
      .json({
        status: "error",
        message: "No puede modificar el carrito de otro usuario",
      });
  }
  next();
};
