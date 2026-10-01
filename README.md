# 🌸 CX Macros | Florencia Bagnis

<img width="1347" height="824" alt="image" src="https://github.com/user-attachments/assets/a2350a1d-fcc7-4847-8b82-caf635b571aa" />

> Herramienta de plantillas de respuestas para **Customer Experience**, hecha con **React**. Eliges una plantilla, completas los datos del cliente y copias la respuesta lista para enviar. 💗


## 🌐 Demo Online

<p align="center">
  <a href="https://cx-macros.vercel.app">
    <img src="https://img.shields.io/badge/Ver_Portfolio-Abrir_Proyecto-ff69b4?style=for-the-badge&logo=github&logoColor=white" alt="Ver Demo" />
  </a>
</p>

---

## 💡 ¿Por qué hice este proyecto?

Me dedico a **Customer Experience** y quise sumar una herramienta para usar en el día a día que, a la vez, me ayudara a **implementar y entender React**.

Escribir la misma respuesta una y otra vez cansa y es fácil equivocarse con un nombre o un número de pedido. Con CX Macros dejo las respuestas armadas, completo solo lo que cambia y copio el mensaje. Así aprendo React con algo que realmente uso.

---

## ✨ Características

- 📋 **Plantillas de respuesta** listas para usar, organizadas por categoría (Envíos, Pagos, Reclamos, Cuenta).
- 🧩 **Campos que se completan solos:** escribiendo `{{nombre}}` o `{{pedido}}` en una plantilla, la app crea un campo para completar y arma la respuesta en una vista previa en vivo.
- ⚠️ **Aviso de datos pendientes:** te dice qué campos faltan completar antes de copiar.
- 📎 **Copiar con un clic:** copia la respuesta lista y confirma con "¡Copiado!".
- ➕ **Crear, editar y eliminar** tus propias plantillas.
- ⭐ **Favoritas:** marca las que más usas y fíltralas.
- 🔎 **Buscador y filtros por categoría.**
- 🌙 **Modo claro y oscuro:** respeta la preferencia de tu dispositivo y recuerda tu elección.
- 💾 **Guardado en el navegador:** tus cambios quedan guardados sin necesidad de cuenta ni servidor.
- ♻️ **Restaurar plantillas de ejemplo** cuando quieras volver al inicio.
- 📱 **Responsive:** en el celular el panel de plantillas se puede plegar con una solapa, para que la respuesta quede a la vista.

---

## 🧭 Cómo se usa

1. **Elige** una plantilla de la lista (o búscala).
2. **Completa** los campos que aparecen, como nombre o número de pedido.
3. **Revisa** la vista previa de la respuesta.
4. **Copia** la respuesta y pégala donde la necesites.

Para crear una propia: **Nueva plantilla**, escribe el título, la categoría y el texto, e incluye los campos con llaves dobles, por ejemplo `Hola {{nombre}}, tu pedido {{pedido}} ya fue despachado.`

> 💾 Las plantillas se guardan en **tu navegador**. Si borras los datos del sitio o cambias de navegador o dispositivo, vuelven las de ejemplo.

---

## 🛠️ Tecnologías

**🎨 Frontend**
- React (Hooks: `useState` y `useEffect`)
- Vite
- JavaScript
- CSS3 (variables, modo claro/oscuro y diseño responsive)

**💾 Datos**
- localStorage, con manejo de errores por si el navegador lo bloquea

**🧰 Herramientas**
- Git y GitHub
- Vercel
- Visual Studio Code

---

## 🧠 Qué practiqué con React

- 🔁 Estado con `useState` y efectos con `useEffect`.
- 🧾 Formularios controlados (campos y textarea conectados al estado).
- 🧮 Estado derivado: variables, vista previa y filtros calculados a partir de los datos.
- 🔀 Renderizado condicional y listas con `key`.
- 💾 Persistencia con localStorage de forma segura.
- 🎨 Tema claro/oscuro con variables CSS.

---

## 🗂️ Estructura del proyecto

```
CX-macros/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    └── data/
        └── templates.js
```

---

## 🚀 Cómo correrlo en tu computadora

Necesitas tener [Node.js](https://nodejs.org/) instalado.

```bash
# 1. Clonar el repositorio
git clone https://github.com/FlorBagnis/CX-macros.git

# 2. Entrar a la carpeta
cd CX-macros

# 3. Instalar dependencias
npm install

# 4. Iniciar en modo desarrollo
npm run dev
```

Se abre en `http://localhost:5173`. Para generar la versión de producción: `npm run build`.

---

## 🎯 Objetivo

Seguir creciendo en el mundo de la tecnología combinando mi experiencia en **Customer Support** con el desarrollo frontend: crear herramientas útiles, claras y simples de usar para quienes atienden personas todos los días.

---

### 👩‍💻 Autora

**Florencia Bagnis**

* 💼 [LinkedIn](https://www.linkedin.com/in/florencia-bagnis)
* 🐙 [GitHub](https://github.com/FlorBagnis)
* 💻 [Portfolio](https://florbagnis.github.io/Portfolio-FlorBagnis/)
* 💌 [florenciasoledadbagnis@gmail.com](mailto:florenciasoledadbagnis@gmail.com)

> 💗 Proyecto personal desarrollado con **React** y **Vite** para agilizar la atención al cliente y, a la vez, aprender haciendo. Parte de mi portfolio, en la intersección de **Frontend Development**, **Customer Experience** y **Operaciones**.
