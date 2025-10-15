// server.js CON CÓDIGO DE DEPURACIÓN INTEGRADO
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();

// --- INICIO DE DEPURACIÓN ---
// Esto se imprimirá en los logs tan pronto como el servidor se inicie.
console.log('--- VERIFICANDO VARIABLES DE ENTORNO AL INICIO ---');
console.log('SENDGRID_API_KEY (primeros 5 chars):', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.substring(0, 5) + '...' : 'NO ESTÁ DEFINIDA');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NO ESTÁ DEFINIDA');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'NO ESTÁ DEFINIDA');
console.log('--- FIN DE LA VERIFICACIÓN DE VARIABLES ---');
// --- FIN DE DEPURACIÓN ---

const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Demasiados intentos de contacto. Intenta nuevamente en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/zyph-web"
);
const db = mongoose.connection;
db.on("error", (error) => {
  console.error("🗄️ Error de conexión con la base de datos:", error);
});
db.once("open", () => {
  console.log("🗄️ Base de datos: ✓ Conectada");
});

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

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
const validatePhone = (phone) => {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/[\s\-\(\)]/g, ""));
};

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Zyph Technologies API",
  });
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  console.log('--- NUEVA SOLICITUD A /api/contact RECIBIDA ---');
  try {
    // --- DEPURACIÓN DENTRO DE LA RUTA ---
    console.log('Verificando API Key dentro de la ruta:', process.env.SENDGRID_API_KEY ? 'DEFINIDA' : 'NO ESTÁ DEFINIDA');
    if (!process.env.SENDGRID_API_KEY) {
      console.error('ERROR CRÍTICO: SENDGRID_API_KEY no está definida. No se pueden enviar correos.');
      throw new Error('SENDGRID_API_KEY no está definida en el entorno de ejecución.');
    }
    // --- FIN DEPURACIÓN ---

    const { nombre, empresa, email, telefono, mensaje } = req.body;
    
    // Validaciones (Aquí he incluido las que tenía en su código original)
    if (!nombre || !empresa || !email || !telefono || !mensaje) {
      return res.status(400).json({ success: false, error: "Todos los campos son obligatorios" });
    }
    if (nombre.length < 2 || nombre.length > 50) {
      return res.status(400).json({ success: false, error: "El nombre debe tener entre 2 y 50 caracteres" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: "Email inválido" });
    }
    if (!validatePhone(telefono)) {
      return res.status(400).json({ success: false, error: "Teléfono inválido" });
    }
    if (mensaje.length < 10 || mensaje.length > 1000) {
      return res.status(400).json({ success: false, error: "El mensaje debe tener entre 10 y 1000 caracteres" });
    }

    const newContact = new Contact({ nombre, empresa, email, telefono, mensaje, ip: req.ip });
    await newContact.save();
    console.log('Contacto guardado en la base de datos.');

    // He reconstruido los objetos de correo basándome en su código anterior
    const mailOptionsToAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `Nuevo contacto de ${nombre} - Zyph Technologies`,
      html: `<div>... (Contenido del correo para el admin) ...</div>`, // Ponga su HTML aquí
    };
    const mailOptionsToClient = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Gracias por contactarnos - Zyph Technologies",
      html: `<div>... (Contenido del correo para el cliente) ...</div>`, // Ponga su HTML aquí
    };

    console.log(`Intentando enviar correos. De: ${process.env.EMAIL_USER}, A Admin: ${process.env.ADMIN_EMAIL}, A Cliente: ${email}`);
    
    await Promise.all([
      transporter.sendMail(mailOptionsToAdmin),
      transporter.sendMail(mailOptionsToClient),
    ]);
    
    console.log('Llamada a Promise.all de sendMail completada sin errores.');

    res.status(201).json({
      success: true,
      message: "Mensaje enviado correctamente. Te contactaremos pronto.",
      contactId: newContact._id,
    });
  } catch (error) {
    console.error("Error DETALLADO capturado en el bloque CATCH:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor. Intenta nuevamente más tarde.",
    });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});
