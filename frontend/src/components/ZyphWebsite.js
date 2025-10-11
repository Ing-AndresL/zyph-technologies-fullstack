import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronRight,
  Brain,
  Cog,
  BarChart3,
  Users,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  ArrowRight,
  Zap,
  Loader2,
} from "lucide-react";

const ZyphWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    mensaje: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const API_URL = "http://localhost:3001/api";

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "services", "projects", "about", "contact"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.nombre.trim() || formData.nombre.length < 2) {
      errors.push("El nombre debe tener al menos 2 caracteres");
    }

    if (!formData.empresa.trim()) {
      errors.push("La empresa es obligatoria");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push("Email inválido");
    }

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.telefono.replace(/[\s\-\(\)]/g, ""))) {
      errors.push("Teléfono inválido");
    }

    if (!formData.mensaje.trim() || formData.mensaje.length < 10) {
      errors.push("El mensaje debe tener al menos 10 caracteres");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSubmitStatus({
        type: "error",
        message: validationErrors[0],
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({
          type: "success",
          message: "¡Mensaje enviado correctamente! Te contactaremos pronto.",
        });
        setFormData({
          nombre: "",
          empresa: "",
          email: "",
          telefono: "",
          mensaje: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message:
            result.error || "Error al enviar el mensaje. Intenta nuevamente.",
        });
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      setSubmitStatus({
        type: "error",
        message:
          "Error de conexión. Verifica tu internet e intenta nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      icon: Brain,
      title: "Consultoría en Transformación Digital con IA",
      description:
        "Diagnóstico de procesos que pueden automatizarse con IA. Plan de adopción tecnológica a la medida de cada negocio.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Cog,
      title: "Automatización de Procesos (RPA + IA)",
      description:
        "Chatbots inteligentes para atención al cliente. Automatización de reportes financieros, ventas y RRHH. Flujos automatizados con Zapier, Make o APIs.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: BarChart3,
      title: "Análisis de Datos y BI con IA",
      description:
        "Dashboards inteligentes en Power BI, Tableau o Looker. Modelos predictivos para ventas, clientes e inventario. Limpieza y organización de datos con Python/IA.",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  const projects = [
    {
      title: "Automatización E-commerce",
      description: "Chatbot inteligente que aumentó conversiones 35%",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop",
      metrics: ["35% ↑ Conversiones", "50% ↓ Tiempo respuesta"],
    },
    {
      title: "Dashboard Predictivo",
      description: "Sistema de predicción de ventas con 92% precisión",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      metrics: ["92% Precisión", "25% ↑ ROI"],
    },
    {
      title: "Automatización RRHH",
      description: "Procesamiento automático de candidatos",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
      metrics: ["80% ↓ Tiempo", "100+ Candidatos/día"],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Zyph Technologies
              </span>
            </div>
            {/* FIN - CÓDIGO ACTUALIZADO */}

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {["home", "services", "projects", "about", "contact"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => scrollToSection(item)}
                      className={`capitalize transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === item
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {item === "projects"
                        ? "Casos de Éxito"
                        : item === "about"
                        ? "Nosotros"
                        : item === "contact"
                        ? "Contacto"
                        : item === "services"
                        ? "Servicios"
                        : "Inicio"}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {["home", "services", "projects", "about", "contact"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="capitalize block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  >
                    {item === "projects"
                      ? "Casos de Éxito"
                      : item === "about"
                      ? "Nosotros"
                      : item === "contact"
                      ? "Contacto"
                      : item === "services"
                      ? "Servicios"
                      : "Inicio"}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-cyan-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Impulsamos tu negocio con{" "}
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
                  IA, automatización
                </span>{" "}
                y análisis de datos
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transformamos procesos empresariales mediante inteligencia
                artificial y automatización, generando eficiencia y crecimiento
                sostenible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection("services")}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span>Nuestros Servicios</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  Contáctanos
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl transform rotate-6 opacity-10"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">50+</div>
                    <div className="text-sm text-gray-600">
                      Procesos Automatizados
                    </div>
                  </div>
                  <div className="text-center p-4 bg-cyan-50 rounded-xl">
                    <div className="text-2xl font-bold text-cyan-600">95%</div>
                    <div className="text-sm text-gray-600">
                      Eficiencia Mejorada
                    </div>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-xl">
                    <div className="text-2xl font-bold text-indigo-600">
                      30+
                    </div>
                    <div className="text-sm text-gray-600">
                      Empresas Transformadas
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">24/7</div>
                    <div className="text-sm text-gray-600">
                      Soporte Continuo
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluciones integrales de IA y automatización diseñadas para
              impulsar tu negocio
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-6">
                  <button className="text-blue-600 font-semibold flex items-center space-x-2 group-hover:space-x-3 transition-all duration-300">
                    <span>Saber más</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Casos de Éxito
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proyectos que demuestran el poder transformador de nuestras
              soluciones
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.metrics.map((metric, metricIndex) => (
                      <span
                        key={metricIndex}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Sobre Nosotros
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                En Zyph Technologies, creemos que la inteligencia artificial y
                la automatización son las herramientas que definirán el futuro
                de los negocios. Nuestro equipo de expertos se dedica a hacer
                que esta transformación sea accesible y efectiva para empresas
                de todos los tamaños.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Nuestra visión es ser el socio estratégico que impulse la
                innovación tecnológica en cada organización, generando valor
                real a través de soluciones inteligentes y sostenibles.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Experiencia Comprobada</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Soluciones Personalizadas
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Soporte 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">ROI Garantizado</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl transform -rotate-6 opacity-10"></div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Equipo trabajando"
                className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Contáctanos y descubre cómo podemos impulsar tu empresa con IA y
              automatización
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Envíanos un mensaje
                </h3>

                {/* Estado del formulario */}
                {submitStatus && (
                  <div
                    className={`mb-6 p-4 rounded-lg border ${
                      submitStatus.type === "success"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {submitStatus.type === "success" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <X className="h-5 w-5" />
                      )}
                      <span>{submitStatus.message}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) =>
                          handleInputChange("nombre", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Tu nombre"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Empresa *
                      </label>
                      <input
                        type="text"
                        value={formData.empresa}
                        onChange={(e) =>
                          handleInputChange("empresa", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Tu empresa"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="tu@email.com"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) =>
                        handleInputChange("telefono", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="+595 123 456 789"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.mensaje}
                      onChange={(e) =>
                        handleInputChange("mensaje", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                      placeholder="Cuéntanos sobre tu proyecto..."
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <span>Enviar Mensaje</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Información de Contacto
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">contacto@zyph.tech</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Teléfono</h4>
                      <p className="text-gray-600">+595 123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Ubicación</h4>
                      <p className="text-gray-600">
                        Ciudad Empresarial
                        <br />
                        Asunción, Paraguay
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  ¿Tienes un proyecto en mente?
                </h3>
                <p className="mb-6 opacity-90">
                  Agenda una consulta gratuita de 30 minutos y descubre cómo
                  podemos ayudarte.
                </p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                  Agendar Consulta
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">Zyph Technologies</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Transformamos negocios mediante inteligencia artificial y
                automatización, creando soluciones innovadoras para el futuro
                digital.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Consultoría en IA</li>
                <li>Automatización RPA</li>
                <li>Análisis de Datos</li>
                <li>Business Intelligence</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contacto@zyph.tech</li>
                <li>+595 123 456 789</li>
                <li>Asunción, Paraguay</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Zyph Technologies. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ZyphWebsite;
