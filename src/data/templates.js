// Plantillas de ejemplo. Las variables van entre llaves dobles: {{nombre}}
export const CATEGORIES = ["Envíos", "Pagos", "Reclamos", "Cuenta"];

export const TEMPLATES = [
  { id: 1, category: "Envíos", title: "Estado del pedido",
    body: "Hola {{nombre}}, ¡gracias por escribirnos! Revisé tu pedido {{pedido}} y figura como {{estado}}. Apenas haya novedades te avisamos. Cualquier otra duda, acá estoy.\n\n¡Saludos!\n{{agente}}" },
  { id: 2, category: "Envíos", title: "Pedido demorado",
    body: "Hola {{nombre}}, lamento la demora con tu pedido {{pedido}}. Lo consulté con el correo y la nueva fecha estimada de entrega es el {{fecha}}. Te mantengo al tanto si hay cambios.\n\n¡Saludos!\n{{agente}}" },
  { id: 3, category: "Envíos", title: "Cambio de dirección",
    body: "Hola {{nombre}}, para cambiar la dirección de tu pedido {{pedido}} necesito que me confirmes la dirección completa (calle, número, localidad y código postal). Si el pedido ya salió, el cambio puede no ser posible y te aviso cómo seguimos.\n\n{{agente}}" },
  { id: 4, category: "Pagos", title: "Pago pendiente",
    body: "Hola {{nombre}}, tu pago del pedido {{pedido}} figura como pendiente. Puede tardar hasta {{plazo}} en acreditarse según el medio de pago. Si pasado ese tiempo sigue igual, escribinos y lo revisamos juntos.\n\n{{agente}}" },
  { id: 5, category: "Pagos", title: "Pago rechazado",
    body: "Hola {{nombre}}, el pago de tu pedido {{pedido}} fue rechazado por el medio de pago. Te recomiendo verificar los datos de la tarjeta, el límite disponible o probar con otro medio. Si querés, te ayudo a reintentar.\n\n{{agente}}" },
  { id: 6, category: "Pagos", title: "Solicitud de factura",
    body: "Hola {{nombre}}, para emitir la factura del pedido {{pedido}} necesito tu nombre completo, DNI o CUIT y condición frente al IVA. Apenas la tenga, te la envío por este medio.\n\n{{agente}}" },
  { id: 7, category: "Reclamos", title: "Producto dañado",
    body: "Hola {{nombre}}, lamento mucho que tu pedido {{pedido}} haya llegado dañado. ¿Podés enviarme una foto del producto y del embalaje? Con eso gestiono el cambio o la devolución lo antes posible.\n\n{{agente}}" },
  { id: 8, category: "Reclamos", title: "Producto equivocado",
    body: "Hola {{nombre}}, disculpá el error con tu pedido {{pedido}}. Para resolverlo, ¿me confirmás qué producto recibiste y me mandás una foto? Enseguida coordinamos el envío del correcto.\n\n{{agente}}" },
  { id: 9, category: "Reclamos", title: "Devolución",
    body: "Hola {{nombre}}, podés devolver el pedido {{pedido}} dentro de los {{plazo}} desde que lo recibiste, con el producto sin uso y en su empaque original. Te paso los pasos a seguir y coordinamos el envío de vuelta.\n\n{{agente}}" },
  { id: 10, category: "Cuenta", title: "Recuperar contraseña",
    body: "Hola {{nombre}}, para recuperar tu contraseña ingresá a la página de inicio de sesión y tocá \"Olvidé mi contraseña\". Te llegará un correo con el enlace; si no lo ves, revisá la carpeta de spam.\n\n{{agente}}" },
  { id: 11, category: "Cuenta", title: "Cambio de email",
    body: "Hola {{nombre}}, para cambiar el email de tu cuenta necesito verificar que seas la titular. ¿Me confirmás el email actual y el nuevo? Una vez validado, hago el cambio.\n\n{{agente}}" },
  { id: 12, category: "Cuenta", title: "Cierre de consulta",
    body: "Hola {{nombre}}, me alegra haber podido ayudarte. Si te surge otra consulta, escribinos cuando quieras. ¡Que tengas un lindo día!\n\n{{agente}}" }
];
