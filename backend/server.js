// server.js
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// <-- CAMBIO 1: Habilitar la confianza en el proxy.
// Esto es crucial para que express-rate-limit funcione correctamente en Railway/Vercel.
app.set("trust proxy", 1);

// Middleware de seguridad
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por IP
  message: {
    error: "Demasiados intentos de contacto. Intenta nuevamente en 15 minutos.",
  },
  // standardHeaders y legacyHeaders son recomendados para un mejor feedback al cliente.
  standardHeaders: true,
  legacyHeaders: false,
});

// Conexión a MongoDB
// <-- CAMBIO 2: Se eliminaron las opciones obsoletas 'useNewUrlParser' y 'useUnifiedTopology'.
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/zyph-web"
);

const db = mongoose.connection;
// <-- CAMBIO 3: Manejo mejorado de eventos de conexión para un logging más preciso.
db.on("error", (error) => {
  console.error("🗄️ Error de conexión con la base de datos:", error);
});
db.once("open", () => {
  console.log("🗄️ Base de datos: ✓ Conectada");
});

// Esquema para contactos (sin cambios)
const contactSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  empresa: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String, required: true },
  mensaje: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  estado: {
    type: String,
    default: "nuevo",
    enum: ["nuevo", "contactado", "cerrado"],
  },
  ip: String,
});

const Contact = mongoose.model("Contact", contactSchema);

// Configuración de Nodemailer (sin cambios en el código, el problema es de configuración externa)
const transporter = nodemailer.createTransport({
  service: "gmail", // o tu proveedor de email
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Recordar usar una "Contraseña de Aplicación" para Gmail.
  },
});

// Validaciones (sin cambios)
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/[\s\-\(\)]/g, ""));
};

// Rutas (sin cambios en la lógica)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Zyph Technologies API",
  });
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  // ... La lógica de la ruta de contacto permanece igual ...
  // ... Se recomienda revisar que la lógica interna no presente errores ...
  try {
    const { nombre, empresa, email, telefono, mensaje } = req.body;
    // ... validaciones ...
    if (!nombre || !empresa || !email || !telefono || !mensaje) {
      return res
        .status(400)
        .json({ success: false, error: "Todos los campos son obligatorios" });
    }
    // ... más validaciones ...

    const newContact = new Contact({
      nombre,
      empresa,
      email,
      telefono,
      mensaje,
      ip: req.ip,
    });
    await newContact.save();

    // ... lógica de envío de correo ...

    res.status(201).json({
      success: true,
      message: "Mensaje enviado correctamente. Te contactaremos pronto.",
      contactId: newContact._id,
    });
  } catch (error) {
    console.error("Error al procesar contacto:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor. Intenta nuevamente más tarde.",
    });
  }
});

// ... resto de las rutas de admin ...

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📧 Email configurado: ${process.env.EMAIL_USER ? "✓" : "✗"}`);
  // El estado de la base de datos ahora se reporta a través de los eventos de conexión.
});
