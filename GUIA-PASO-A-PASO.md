# Guía paso a paso – Plan Entrega Final

Seguí este orden para implementar todo y entender cada tema. Cada paso incluye **qué hacer**, **por qué** y **dónde**.

---

## Paso 1: DTO de usuario y ruta `/current` ✅ (empezamos acá)

**Qué vas a hacer:** Crear un DTO (Data Transfer Object) que transforma el documento de usuario de la BD en un objeto “seguro” para enviar al front (sin `password`, `__v`, etc.) y usarlo en GET `/current`.

**Por qué:** Así nunca se filtran datos sensibles “a mano”; hay una función única que define qué puede ver el cliente.

**Archivos:**
- Crear `src/dto/user.dto.js` con la función `toUserCurrentDTO(userDoc)`.
- Modificar `src/routes/sessionsRouter.js`: en GET `/current`, usar el DTO para armar el `payload`.

**Conceptos:** DTO = objeto plano con solo los campos que queremos exponer en la API.

---

## Paso 2: UserDAO (acceso a datos de usuarios)

**Qué vas a hacer:** Crear la capa DAO para usuarios (igual que tenés para productos y carritos): métodos que hablan con MongoDB (findById, findByEmail, create, etc.).

**Por qué:** Las rutas y la lógica de negocio no deben usar el modelo de Mongoose directo; el DAO encapsula el acceso a datos.

**Archivos:** Crear `src/dao/userDBManager.js` con los métodos que necesiten las sesiones y más adelante el reset de contraseña.

---

## Paso 3: Repositories (Product, Cart, User)

**Qué vas a hacer:** Crear “repositories” que usen los DAOs y concentren la lógica de negocio. Las rutas llaman a los repositories, no a los DAOs directo.

**Por qué:** Separación de responsabilidades: DAO = acceso a datos; Repository = reglas de negocio y orquestación.

**Archivos:** `src/repositories/product.repository.js`, `cart.repository.js`, `user.repository.js`. Luego cambiar las rutas de productos y carrito para que usen estos repositories.

---

## Paso 4: Middlewares de autorización

**Qué vas a hacer:** 
- `requireAdmin`: solo rol admin puede crear/actualizar/eliminar productos.
- `requireUserCart`: solo el dueño del carrito (req.user.cart === cid) puede modificar ese carrito.

**Por qué:** La autorización (quién puede hacer qué) se centraliza en middlewares reutilizables.

**Archivos:** `src/middlewares/authorization.middleware.js` (o ampliar `auth.middleware.js`). Aplicar en productRouter y cartRouter.

---

## Paso 5: Recuperación de contraseña

**Qué vas a hacer:** 
- Campos en User: `resetPasswordToken`, `resetPasswordExpires`.
- Endpoints: POST forgot-password (envía email con enlace), POST reset-password (valida token y nueva contraseña ≠ anterior).
- Configurar mailing (Nodemailer) y variables de entorno.

**Archivos:** Modelo User, UserDAO, UserRepository, sessionsRouter, config de mail, .env.

---

## Paso 6: Modelo Ticket y lógica de compra

**Qué vas a hacer:** Crear modelo Ticket, TicketDAO, TicketRepository; lógica que verifica stock, genera ticket con los ítems comprados y maneja los no procesados. Endpoint POST purchase/checkout.

**Archivos:** ticketModel, ticketDBManager, ticket.repository, ruta en cartRouter o purchaseRouter.

---

## Paso 7: Config y variables de entorno

**Qué vas a hacer:** Centralizar variables en `src/config` y crear `.env.example` con todas las variables documentadas.

---

Cuando termines el **Paso 1**, avisá y seguimos con el Paso 2. Si algo no te cierra, preguntá antes de avanzar.
