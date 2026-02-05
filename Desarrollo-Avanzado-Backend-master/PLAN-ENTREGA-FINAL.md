# Plan de Implementación – Entrega Final

## Resumen de la consigna

- **Patrón Repository**: usar Repository sobre el DAO en la lógica de negocio.
- **Ruta `/current`**: responder con un DTO (sin datos sensibles).
- **Recuperación de contraseña**: email con enlace (expira 1h), no permitir reutilizar la misma contraseña.
- **Middleware de autorización**: junto con estrategia "current" → solo admin CRUD productos; solo usuario agrega a su carrito.
- **Arquitectura profesional**: patrones, variables de entorno, mailing.
- **Lógica de compra**: roles, autorizaciones y **modelo Ticket** con compra robusta (stock, ticket, compras completas/incompletas).

**Criterios de evaluación**: DAO/DTO bien estructurados, Repository separando acceso a datos de lógica de negocio, middleware de autorización con "current", modelo Ticket y lógica de compra robusta.

---

## Fase 1: Capa de persistencia (DAO y DTO)

### 1.1 DTOs

| Tarea              | Descripción                                                                                                | Archivos                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| DTO User (current) | Objeto con solo: `id`, `first_name`, `last_name`, `email`, `age`, `role`, `cart`. Sin `password` ni `__v`. | `src/dto/user.dto.js`               |
| DTO Product        | Para respuestas de productos (opcional, evita filtrar a mano).                                             | `src/dto/product.dto.js` (opcional) |
| DTO Ticket         | Para respuesta de compra: `code`, `purchase_datetime`, `amount`, `purchaser`, etc.                         | `src/dto/ticket.dto.js` (Fase 5)    |

**Ejemplo `user.dto.js`:**

```js
// toUserCurrentDTO(userDoc) → { id, first_name, last_name, email, age, role, cart }
```

### 1.2 DAOs (mantener / refactorizar)

| Tarea                  | Descripción                                                                                                                                           | Archivos                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Mantener DAOs actuales | `productDBManager`, `cartDBManager` ya son la capa de acceso a datos. Opcional: renombrar a `ProductDAO`, `CartDAO` y exponer como instancias únicas. | `src/dao/productDBManager.js`, `src/dao/cartDBManager.js` |
| UserDAO                | Crear DAO de usuarios: `findById`, `findByEmail`, `create`, `updatePassword`, `setResetToken`, `findByResetToken`.                                    | `src/dao/userDBManager.js` (nuevo)                        |
| TicketDAO              | Crear DAO para tickets: `create`, `findByPurchaser`, etc.                                                                                             | `src/dao/ticketDBManager.js` (Fase 5)                     |

---

## Fase 2: Patrón Repository

### 2.1 Repositories

Los **repositories** usan los DAOs y concentran la **lógica de negocio** (validaciones, reglas, orquestación). Las rutas llaman a los repositories, no directamente a los DAOs.

| Tarea             | Descripción                                                                                                                                                                               | Archivos                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| ProductRepository | Métodos que usan `productDBManager`: getAll, getById, create, update, delete. Lógica de “solo admin” se aplica en ruta con middleware, no aquí.                                           | `src/repositories/product.repository.js`         |
| CartRepository    | Métodos que usan `cartDBManager`: getCart, createCart, addProduct, updateProduct, deleteProduct, emptyCart. Validar que el carrito pertenezca al usuario.                                 | `src/repositories/cart.repository.js`            |
| UserRepository    | Métodos que usan UserDAO: getById, getByEmail, register (crear usuario + carrito), updatePassword, requestPasswordReset, resetPassword (validar token y que nueva contraseña ≠ anterior). | `src/repositories/user.repository.js`            |
| TicketRepository  | Crear ticket, listar por usuario. Orquestar con CartRepository y ProductRepository para la compra.                                                                                        | `src/repositories/ticket.repository.js` (Fase 5) |

### 2.2 Integración en rutas

- Reemplazar llamadas directas a `productDBManager` / `cartDBManager` por llamadas a los repositories.
- Mantener los DAOs como dependencias inyectadas en los repositories (o instanciados dentro del repo).

---

## Fase 3: Ruta `/current` y DTO

| Tarea                  | Descripción                                                                                                                                          | Archivos                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| DTO usuario actual     | Implementar `toUserCurrentDTO(user)` que devuelva solo campos no sensibles.                                                                          | `src/dto/user.dto.js`          |
| Modificar GET /current | Después de `passport.authenticate('current')`, usar el DTO para armar el `payload` de la respuesta. No enviar `password`, `__v`, ni otros sensibles. | `src/routes/sessionsRouter.js` |

---

## Fase 4: Recuperación de contraseña

### 4.1 Modelo y DAO

| Tarea          | Descripción                                                                                                                    | Archivos                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| Campos en User | Agregar `resetPasswordToken` (String), `resetPasswordExpires` (Date). Opcional: índice por token.                              | `src/dao/models/userModel.js` |
| UserDAO        | `setResetToken(email, token, expiresAt)`, `findByResetToken(token)`, `updatePassword(userId, hashedPassword)` y limpiar token. | `src/dao/userDBManager.js`    |

### 4.2 Lógica de negocio (UserRepository / Services)

| Tarea                  | Descripción                                                                                                                                                          | Archivos                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Solicitar reset        | Generar token (crypto.randomBytes), guardar en usuario con expiración 1h. Enviar email con enlace `BASE_URL/reset-password?token=xxx`.                               | `src/repositories/user.repository.js` o `src/services/email.service.js` + sesiones |
| Restablecer contraseña | Endpoint que recibe `token` + `newPassword`. Validar: token existe, no expirado, `newPassword` hasheada ≠ contraseña actual. Si todo ok, actualizar y limpiar token. | Mismo repo + ruta                                                                  |

### 4.3 Email

| Tarea              | Descripción                                                                                | Archivos                                                    |
| ------------------ | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Configurar mailing | Nodemailer (o similar). Variables: `MAIL_USER`, `MAIL_PASS`, `BASE_URL` (para el enlace).  | `.env`, `src/config/mail.config.js` o `src/utils/mailer.js` |
| Template           | Email con botón “Restablecer contraseña” que apunte a `BASE_URL/reset-password?token=...`. | Función en `mailer` o template HTML                         |

### 4.4 Rutas

| Tarea                              | Descripción                                                                                                               | Archivos                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| POST /api/sessions/forgot-password | Body: `{ email }`. Genera token, guarda, envía email. Respuesta genérica (“Si el email existe, recibirás instrucciones”). | `src/routes/sessionsRouter.js`                              |
| POST /api/sessions/reset-password  | Body: `{ token, newPassword }`. Valida token, expiración y que nueva ≠ anterior; actualiza y responde.                    | `src/routes/sessionsRouter.js`                              |
| Vista reset (opcional)             | Página con formulario para nueva contraseña; recibe `token` por query.                                                    | `src/views/resetPassword.handlebars`, ruta en `viewsRouter` |

---

## Fase 5: Middleware de autorización

### 5.1 Requisitos

- Solo **admin**: crear, actualizar y eliminar productos.
- Solo **usuario** (rol user): agregar productos a **su** carrito (no al de otro).

### 5.2 Implementación

| Tarea                        | Descripción                                                                                        | Archivos                                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Middleware `requireAuth`     | Ya existe o se usa Passport. Asegurar que `req.user` esté disponible (estrategia "current" o JWT). | `src/middlewares/auth.middleware.js`          |
| Middleware `requireAdmin`    | Si `req.user.role !== 'admin'` → 403. Usar en POST/PUT/DELETE de productos.                        | `src/middlewares/authorization.middleware.js` |
| Middleware `requireUserCart` | Para rutas de carrito: validar que `req.params.cid` sea igual a `req.user.cart`. Si no, 403.       | Mismo archivo o `auth.middleware.js`          |

### 5.3 Aplicación en rutas

| Ruta                                                                  | Middleware                                                                        |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| POST /api/products, PUT /api/products/:pid, DELETE /api/products/:pid | `passport.authenticate('current')`, `requireAdmin`                                |
| POST /api/carts/:cid/product/:pid (y variantes)                       | `passport.authenticate('current')`, `requireUserCart`                             |
| GET /api/carts/:cid (ver carrito)                                     | `passport.authenticate('current')`, `requireUserCart` (o solo que sea su carrito) |

---

## Fase 6: Modelo Ticket y lógica de compra

### 6.1 Modelo Ticket

| Tarea         | Descripción                                                                                                                                                               | Archivos                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Ticket schema | Campos: `code` (único, autogenerado o UUID), `purchase_datetime`, `amount`, `purchaser` (ref User), `products` (array de { product, quantity, priceSnapshot } o similar). | `src/dao/models/ticketModel.js` |
| TicketDAO     | `create(ticketData)`, `findByPurchaser(userId)`.                                                                                                                          | `src/dao/ticketDBManager.js`    |

### 6.2 Lógica de compra

| Tarea                         | Descripción                                                                                                                                                                                                                                                                                                                                                                             | Archivos                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Servicio/Repository de compra | 1) Obtener carrito con productos poblados. 2) Por cada ítem: verificar stock. 3) Separar ítems con stock suficiente / insuficiente. 4) Si hay suficientes: descontar stock, crear Ticket con esos ítems y monto total, sacar del carrito los comprados (o vaciar y dejar solo los no comprados). 5) Responder: ticket creado, productos comprados, productos no procesados (sin stock). | `src/repositories/ticket.repository.js` o `src/services/purchase.service.js` |
| Endpoint                      | POST /api/carts/:cid/purchase (o POST /api/carts/:cid/checkout). Requiere usuario autenticado y que `cid === req.user.cart`. Llama a la lógica de compra y devuelve ticket + detalle.                                                                                                                                                                                                   | `src/routes/cartRouter.js` o `purchaseRouter.js`                             |

### 6.3 DTO Ticket (opcional)

- `toTicketDTO(ticketDoc)` para la respuesta (code, amount, purchaser, products, datetime).

---

## Fase 7: Arquitectura y variables de entorno

| Tarea                  | Descripción                                                                                                                     | Archivos                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Centralizar env        | Usar un módulo que exporte `config` con `PORT`, `MONGO_URI`, `JWT_SECRET`, `COOKIE_SECRET`, `MAIL_*`, `BASE_URL`, etc.          | `src/config/env.js` o `src/config/index.js` |
| .env.example           | Listar todas las variables necesarias sin valores sensibles. Entregar también .env según consigna (en el repo o instrucciones). | `.env.example`                              |
| Estructura de carpetas | Dejar claro: `config`, `dao`, `dto`, `repositories`, `routes`, `middlewares`, `services` (si se usa), `utils`, `views`.         | Reorganizar si hace falta                   |

---

## Orden sugerido de implementación

1. **Fase 1.1 + 3**: DTO de usuario y modificar `/current` (rápido y claro).
2. **Fase 1.2 (UserDAO) + 2 (Repositories básicos)**: UserDAO, UserRepository; ProductRepository y CartRepository usando los DAOs actuales.
3. **Fase 5**: Middlewares de autorización y aplicarlos en productos y carrito.
4. **Fase 4**: Recuperación de contraseña (modelo, DAO, mailing, rutas).
5. **Fase 6**: Modelo Ticket, TicketDAO, TicketRepository, lógica de compra y endpoint de purchase.
6. **Fase 7**: Ajustes de config y .env.example.

---

## Checklist final

- [ ] DTOs definidos y usados (user para `/current`, ticket para compra).
- [ ] DAOs claros (Product, Cart, User, Ticket).
- [ ] Repositories usan DAOs; rutas usan Repositories.
- [ ] `/current` responde solo con DTO (sin datos sensibles).
- [ ] Recuperación de contraseña: email, enlace con expiración 1h, no reutilizar contraseña anterior.
- [ ] Middleware admin en crear/actualizar/eliminar productos.
- [ ] Middleware para que solo el usuario modifique su carrito (`cid === user.cart`).
- [ ] Modelo Ticket con campos necesarios.
- [ ] Lógica de compra: verificación de stock, generación de ticket, manejo de compras completas/incompletas.
- [ ] Variables de entorno documentadas (.env.example) y arquitectura ordenada.

Cuando quieras, podemos bajar esto a código paso a paso (empezando por DTO + `/current` y luego Repository + autorización).
