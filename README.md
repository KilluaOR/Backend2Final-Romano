🛒 Killu Store API - Entrega Final Backend
Proyecto de e-commerce profesional desarrollado con Node.js, Express y MongoDB, aplicando arquitectura de capas y patrones de diseño.

🚀 Instrucciones Cruciales para la Corrección
Para que el flujo de compra y la validación de roles funcionen correctamente, por favor siga estos pasos:

1. Configuración de Variables de Entorno (.env)
   Es indispensable contar con el archivo .env en la raíz del proyecto. Las variables necesarias son:

MONGO_URL: URL de conexión a MongoDB Atlas.

JWT_SECRET: Clave secreta para la firma de tokens.

COOKIE_SECRET: Clave secreta para cookies firmadas.

MAIL_USER: Correo de Gmail (emisor).

MAIL_PASS: Contraseña de aplicación (16 caracteres) de Google.

2. Prueba del Sistema de Mailing
   El sistema envía un ticket de compra automático al finalizar el proceso.

Importante: Para recibir el correo, debe registrarse con un email real.

Si el email es ficticio, la compra se procesará (Ticket generado y stock descontado), pero el envío fallará silenciosamente mediante un bloque try/catch para no interrumpir el flujo.

3. Cambio de Roles (Admin/User)
   Al registrarse, el usuario tiene por defecto el rol user.

Para probar rutas de administrador (Crear/Editar productos), modifique el campo role a "admin" directamente en la base de datos.

Nota: Tras cambiar el rol en la DB, debe cerrar sesión y volver a loguearse para renovar el JWT de la cookie.

🛠️ Arquitectura y Patrones Aplicados
DAO (Data Access Object): Capa de persistencia desacoplada para modelos de MongoDB.

DTO (Data Transfer Object): Aplicado en /current y login para filtrar información sensible (ej. password) y normalizar la respuesta.

Patrón Repository: Lógica de negocio (como el proceso de compra) centralizada en repositorios.

Manejo de Stock: El proceso de /purchase valida disponibilidad en tiempo real. Los productos sin stock permanecen en el carrito.

Ticket de Compra: Generación de ticket con código único, timestamp y monto total.

Seguridad Robusta: Validación de roles en el Backend (middleware) que devuelve 403 Forbidden ante intentos de acceso no autorizados por API (Postman/Thunder Client).

🛣️ Endpoints Principales para Testear
Método,Ruta,Descripción
POST,/api/sessions/register,Registro de nuevo usuario.
POST,/api/sessions/login,Login y generación de jwtCookie.
GET,/api/sessions/current,Devuelve el usuario logueado (vía DTO).
POST,/api/products,Crear producto (Solo Admin).
POST,/api/carts/:cid/product/:pid,Agregar al carrito (Solo User dueño del cart).
POST,/api/carts/:cid/purchase,Finalizar Compra (Genera Ticket y limpia carrito).
