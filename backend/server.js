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
});

// Conexión a MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/zyph-web",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Esquema para contactos
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

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // o tu proveedor de email
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Validaciones
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/[\s\-\(\)]/g, ""));
};

// Rutas
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Zyph Technologies API",
  });
});

// Endpoint para enviar contactos
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { nombre, empresa, email, telefono, mensaje } = req.body;

    // Validaciones
    if (!nombre || !empresa || !email || !telefono || !mensaje) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son obligatorios",
      });
    }

    if (nombre.length < 2 || nombre.length > 50) {
      return res.status(400).json({
        success: false,
        error: "El nombre debe tener entre 2 y 50 caracteres",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Email inválido",
      });
    }

    if (!validatePhone(telefono)) {
      return res.status(400).json({
        success: false,
        error: "Teléfono inválido",
      });
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

    // Enviar email de notificación
    const mailOptionsToAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `Nuevo contacto de ${nombre} - Zyph Technologies`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #06b6d4); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">⚡ Nuevo Contacto</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e293b;">Información del Cliente</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background: #e2e8f0;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">Nombre:</td>
                <td style="padding: 12px; border: 1px solid #cbd5e1;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">Empresa:</td>
                <td style="padding: 12px; border: 1px solid #cbd5e1;">${empresa}</td>
              </tr>
              <tr style="background: #e2e8f0;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">Email:</td>
                <td style="padding: 12px; border: 1px solid #cbd5e1;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; border: 1px solid #cbd5e1;">Teléfono:</td>
                <td style="padding: 12px; border: 1px solid #cbd5e1;">${telefono}</td>
              </tr>
            </table>
            <h3 style="color: #1e293b;">Mensaje:</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
              ${mensaje.replace(/\n/g, "<br>")}
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
              Fecha: ${new Date().toLocaleString("es-ES")}<br>
              IP: ${req.ip}
            </p>
          </div>
        </div>
      `,
    };

    // Email de confirmación al cliente
    const mailOptionsToClient = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Gracias por contactarnos - Zyph Technologies",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #06b6d4); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">⚡ Zyph Technologies</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #1e293b;">¡Hola ${nombre}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">
              Gracias por contactarnos. Hemos recibido tu mensaje y nuestro equipo se pondrá en contacto contigo en las próximas 24 horas.
            </p>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e293b; margin-top: 0;">Resumen de tu consulta:</h3>
              <p><strong>Empresa:</strong> ${empresa}</p>
              <p><strong>Teléfono:</strong> ${telefono}</p>
              <p><strong>Mensaje:</strong> ${mensaje.substring(0, 100)}...</p>
            </div>
            <p style="color: #64748b;">
              Mientras tanto, puedes seguirnos en nuestras redes sociales o explorar más sobre nuestros servicios de IA y automatización.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}" 
                 style="background: linear-gradient(135deg, #2563eb, #06b6d4); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Visitar nuestro sitio web
              </a>
            </div>
            <p style="color: #94a3b8; font-size: 14px; text-align: center;">
              Este es un email automático, por favor no respondas a este mensaje.
            </p>
          </div>
        </div>
      `,
    };

    // Enviar ambos emails
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

// Endpoint para obtener estadísticas (admin)
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

    res.json({
      total,
      nuevos,
      ultimaSemana,
      procesados: total - nuevos,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

// Endpoint para listar contactos (admin)
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
      .select("-ip"); // No enviar IP por privacidad

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

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error("Error no manejado:", error);
  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
  });
});

// 404 para rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📧 Email configurado: ${process.env.EMAIL_USER ? "✓" : "✗"}`);
  console.log(
    `🗄️  Base de datos: ${
      mongoose.connection.readyState === 1 ? "✓ Conectada" : "✗ Desconectada"
    }`
  );
});
