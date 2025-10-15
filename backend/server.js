// server.js - Versión Final y Productiva
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Habilitar la confianza en el proxy para plataformas como Railway/Vercel
app.set("trust proxy", 1);

// Middlewares de seguridad y configuración
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Límite de peticiones para el formulario de contacto
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por IP
  message: {
    error: "Demasiados intentos de contacto. Intenta nuevamente en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Conexión a la base de datos MongoDB
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

// Esquema y Modelo de Mongoose para los contactos
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

// Configuración del transportador de Nodemailer con SendGrid
const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

// Funciones de validación
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/[\s\-\(\)]/g, ""));
};

// --- RUTAS DE LA API ---

// Ruta de Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Zyph Technologies API",
  });
});

// Ruta principal para el formulario de contacto
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { nombre, empresa, email, telefono, mensaje } = req.body;

    // Validaciones del servidor
    if (!nombre || !empresa || !email || !telefono || !mensaje) {
      return res
        .status(400)
        .json({ success: false, error: "Todos los campos son obligatorios" });
    }
    if (nombre.length < 2 || nombre.length > 50) {
      return res.status(400).json({
        success: false,
        error: "El nombre debe tener entre 2 y 50 caracteres",
      });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: "Email inválido" });
    }
    if (!validatePhone(telefono)) {
      return res
        .status(400)
        .json({ success: false, error: "Teléfono inválido" });
    }
    if (mensaje.length < 10 || mensaje.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "El mensaje debe tener entre 10 y 1000 caracteres",
      });
    }

    // Guardar en base de datos
    const newContact = new Contact({
      nombre,
      empresa,
      email,
      telefono,
      mensaje,
      ip: req.ip,
    });
    await newContact.save();

    // Enviar email de notificación al Administrador
    const mailOptionsToAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `Nuevo contacto de ${nombre} - Zyph Technologies`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #2563eb, #06b6d4); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">⚡ Nuevo Contacto Recibido</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e293b; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px;">Información del Cliente</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 16px;">
              <tr style="background: #ffffff;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1; width: 30%;">Nombre:</td>
                <td style="padding: 12px; border: 1px solid #cbd5e1;">${nombre}</td>
              </tr>
              <tr style="background: #f1f5f9;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">Empresa:</td>
                <td style="padding: 12px; border: 1px solid #cbd5e1;">${empresa}</td>
              </tr>
              <tr style="background: #ffffff;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">Email:</td>
                <td style="padding: 12px; border: 1px solid #cbd5e1;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
              </tr>
              <tr style="background: #f1f5f9;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">Teléfono:</td>
                <td style="padding: 12px; border: 1px solid #cbd5e1;">${telefono}</td>
              </tr>
            </table>
            <h3 style="color: #1e293b; margin-top: 30px;">Mensaje:</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; line-height: 1.6;">
              ${mensaje.replace(/\n/g, "<br>")}
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 30px; text-align: center;">
              Fecha: ${new Date().toLocaleString("es-ES")}<br>
              IP del remitente: ${req.ip}
            </p>
          </div>
        </div>
      `,
    };

    // Enviar email de confirmación al Cliente
    const mailOptionsToClient = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Hemos recibido tu mensaje - Zyph Technologies",
      html: `
        <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f7f6;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #2563eb, #06b6d4); padding: 40px 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Zyph Technologies</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #1e293b; font-size: 24px;">¡Hola, ${nombre}!</h2>
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                  Gracias por ponerte en contacto con nosotros. Hemos recibido tu consulta y queremos confirmarte que nuestro equipo ya la está revisando.
                </p>
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                  Nos pondremos en contacto contigo a la brevedad posible, generalmente dentro de las próximas 24 horas hábiles.
                </p>
                <div style="background-color: #f8fafc; border-left: 5px solid #2563eb; margin: 30px 0; padding: 20px;">
                  <h3 style="color: #1e293b; margin-top: 0;">Resumen de tu mensaje:</h3>
                  <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    <strong>Empresa:</strong> ${empresa}<br>
                    <strong>Mensaje:</strong> "${mensaje.substring(0, 150)}${
        mensaje.length > 150 ? "..." : ""
      }"
                  </p>
                </div>
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                  Mientras tanto, te invitamos a explorar más sobre cómo podemos ayudarte a potenciar tu negocio con IA y automatización en nuestro sitio web.
                </p>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding: 20px 0;">
                      <a href="${
                        process.env.FRONTEND_URL || "https://www.zyphtech.tech"
                      }" target="_blank" style="background: #2563eb; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                        Visitar Nuestro Sitio Web
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px 30px; background-color: #e2e8f0;">
                <p style="color: #64748b; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} Zyph Technologies. Todos los derechos reservados.<br><br>
                  Este es un mensaje automático. Por favor, no respondas a este correo.
                </p>
              </td>
            </tr>
          </table>
        </div>
      `,
    };

    // Enviar ambos correos
    await Promise.all([
      transporter.sendMail(mailOptionsToAdmin),
      transporter.sendMail(mailOptionsToClient),
    ]);

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

// Rutas de Administración
app.get("/api/admin/stats", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "No autorizado" });
    }
    const total = await Contact.countDocuments();
    const nuevos = await Contact.countDocuments({ estado: "nuevo" });
    const ultimaSemana = await Contact.countDocuments({
      fechaCreacion: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    res.json({ total, nuevos, ultimaSemana, procesados: total - nuevos });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

app.get("/api/admin/contacts", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "No autorizado" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find()
      .sort({ fechaCreacion: -1 })
      .limit(limit)
      .skip(skip)
      .select("-ip");
    const total = await Contact.countDocuments();
    res.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener contactos" });
  }
});

// --- Middlewares de Error y 404 ---

// Manejador de errores global
app.use((error, req, res, next) => {
  console.error("Error no manejado:", error);
  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
  });
});

// Manejador para rutas no encontradas (404)
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});
