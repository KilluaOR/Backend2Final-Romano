🛒 Killu Store API - Entrega Final Backend
Proyecto de e-commerce profesional desarrollado con Node.js, Express y MongoDB, aplicando arquitectura de capas y patrones de diseño.

🚀 Instrucciones Cruciales para la Corrección
Para que el flujo de compra y la validación de roles funcionen correctamente, por favor siga estos pasos:

1. Configuración de Variables de Entorno (.env)
   Es indispensable contar con el archivo .env en la raíz del proyecto para que el servidor conecte a la base de datos y habilite el sistema de correos. Las variables necesarias son:

MONGO_URL: URL de conexión a MongoDB Atlas.

JWT_SECRET: Clave secreta para la firma de tokens.

COOKIE_SECRET: Clave secreta para cookies firmadas.

MAIL_USER: Correo de Gmail (emisor).

MAIL_PASS: Contraseña de aplicación de 16 caracteres de Google.

2. Prueba del Sistema de Mailing
   El sistema envía un ticket de compra automático al finalizar el proceso en el carrito.

Importante: Para recibir el correo, debe registrarse como un usuario con un email real.

Si el email es ficticio, la compra se procesará correctamente (Ticket generado y stock descontado), pero el envío del mail fallará silenciosamente (manejado mediante un bloque try/catch para no interrumpir la experiencia de usuario).

3. Cambio de Roles (Admin/User)
   El sistema utiliza el patrón Current Strategy de Passport para la autorización:

Al registrarse, el usuario tiene por defecto el rol user.

Para probar las rutas de administrador (Crear/Editar productos), modifique el campo role a "admin" directamente en la base de datos.

Nota: Después de cambiar el rol en la base de datos, debe cerrar sesión y volver a loguearse para que el nuevo JWT genere una cookie con los permisos actualizados.

🛠️ Arquitectura y Patrones Aplicados
El servidor ha sido profesionalizado siguiendo estos lineamientos:

DAO (Data Access Object): Capa de persistencia para el manejo de modelos de MongoDB.

DTO (Data Transfer Object): Implementado en la ruta /api/sessions/current y en el login para filtrar información sensible del usuario (ej. password) y enviar solo lo necesario (first_name, email, role, cart_id).

Patrón Repository: La lógica de negocio pesada (como el proceso de compra) se encuentra en la capa de Repositorios, desacoplándola de los controladores.

Manejo de Stock: El proceso de /purchase valida el stock en tiempo real. Si un producto no tiene disponibilidad, se mantiene en el carrito y no se incluye en el ticket final.

Ticket de Compra: Generación de un modelo Ticket con código único autogenerado, fecha/hora y monto total.

🛣️ Endpoints Principales para Testear
Método,Ruta,Descripción
POST,/api/sessions/register,Registro de nuevo usuario.
POST,/api/sessions/login,Login y generación de jwtCookie.
GET,/api/sessions/current,Devuelve el usuario logueado (vía DTO).
POST,/api/products,Crear producto (Solo Admin).
POST,/api/carts/:cid/product/:pid,Agregar al carrito (Solo User y dueño del cart).
POST,/api/carts/:cid/purchase,Finalizar Compra (Genera Ticket y resta stock).
