# Ecommerce Backend - Proyecto Final

## 🛠️ Configuración de Mailing y Seguridad

Se integró un sistema de mailing profesional siguiendo los criterios de seguridad solicitados para evitar el bloqueo de IP y el marcado de SPAM:

### ✉️ Servicio de Mailing (SMTP)

- **Transporte:** Se utiliza `nodemailer` con protocolo SMTP y servicio de Gmail.
- **Seguridad:** No se exponen credenciales en el código; se utilizan variables de entorno (`MAIL_USER`, `MAIL_PASS`).
- **Argumentos:** Se respeta estrictamente la estructura de envío: `from`, `to`, `subject` y `html`.

### 🛡️ Protección contra SPAM y Abuso

- **Rate Limiter:** Se implementó `express-rate-limit` en las rutas de recuperación de contraseña (`/forgot-password`).
- **Control de Flujo:** El límite está seteado en **3 intentos cada 15 minutos por IP**, protegiendo el dominio de ser utilizado para ataques de fuerza bruta o saturación de correos.
- **Arquitectura:** El envío de mails está desacoplado en un `mailingService`, invocado únicamente desde la lógica de negocio en la capa de Repository/Service.

### 🛒 Proceso de Compra (Ticket)

- El proceso de compra valida el stock de cada producto mediante un **bucle asíncrono `for...of`**.
- Si un producto no tiene stock, permanece en el carrito para futuras compras, mientras que los productos con stock se procesan y generan un **Ticket único e inmutable**.
