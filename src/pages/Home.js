import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { sendContactMessage, getAllTherapists } from '../services/api';

const PASOS = [
  {
    num: 1,
    titulo: 'Registrate',
    desc: 'Creá tu cuenta en minutos y completá tu perfil.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    num: 2,
    titulo: 'Elegí tu especialista',
    desc: 'Explorá los perfiles, especialidades y propuestas de cada terapeuta.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    num: 3,
    titulo: 'Reservá tu turno',
    desc: 'Seleccioná el día y horario que mejor te convenga desde el calendario del terapeuta.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    num: 4,
    titulo: 'Realizá tu pago',
    desc: 'Aboná de forma segura a través de MercadoPago. Tu sesión queda confirmada.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    num: 5,
    titulo: 'Conectate con tu sesión',
    desc: 'Ingresá al videollamada desde cualquier dispositivo. Tu espacio de transformación te espera.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const Home = () => {
  const location = useLocation();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [location.state]);

  useEffect(() => {
    getAllTherapists()
      .then((data) => {
        const sorted = [...data].sort((a, b) =>
          a.userFullName.localeCompare(b.userFullName, 'es')
        );
        setTherapists(sorted.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
    setContactStatus('');
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus('error');
      return;
    }
    setContactLoading(true);
    try {
      await sendContactMessage(contactForm);
      setContactStatus('success');
      setContactForm({ name: '', email: '', message: '' });
    } catch {
      setContactStatus('error');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── 1. INICIO ── */}
      <section id="inicio" className="pt-24 pb-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Título dual-color — contenido a ajustar con el equipo */}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Renacé en <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-mystic-500 to-primary-600">
                  cada ciclo
                </span>
              </h1>
              {/* Reseña — a ajustar con el propósito del equipo */}
              <p className="text-xl text-gray-600">
                Un espacio de encuentro entre quienes buscan y quienes acompañan.
                Ouro nació del símbolo del ouroboros, presente en todas las culturas
                como símbolo de transformación, renovación y autoconocimiento.
              </p>
            </div>

            {/* Placeholder video */}
            <div className="relative">
              <div className="bg-gradient-to-br from-mystic-400 via-primary-500 to-mystic-600 rounded-3xl p-1 shadow-2xl">
                <div className="bg-gray-900 rounded-3xl aspect-video flex items-center justify-center">
                  <div className="text-center px-8">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-white text-opacity-80 text-sm font-medium">
                      Video inspiracional — próximamente
                    </p>
                    <p className="text-white text-opacity-50 text-xs mt-1">
                      El ouroboros a través de las civilizaciones
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. QUIÉNES SOMOS ── */}
      <section id="quienes-somos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Equipo Fundador
            </h2>
            {/* Subtítulo — a ajustar por el equipo */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cada una con su camino, todas comprometidas con tu proceso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fundadora 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-64 bg-gradient-to-br from-mystic-400 via-mystic-500 to-primary-600 relative overflow-hidden flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">L</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Lucila</h3>
                <p className="text-gray-600 mb-4">
                  Co-fundadora de Ouro. Terapeuta comprometida con acompañar procesos de transformación y autoconocimiento.
                </p>
                <Link to="/terapeutas" className="text-mystic-600 hover:text-mystic-700 font-medium">
                  Ver terapeutas →
                </Link>
              </div>
            </div>

            {/* Fundadora 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-64 bg-gradient-to-br from-primary-500 via-mystic-500 to-mystic-600 relative overflow-hidden flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">E</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Elina</h3>
                <p className="text-gray-600 mb-4">
                  Co-fundadora de Ouro. Especialista en bienestar integral, dedicada a crear espacios seguros y de crecimiento personal.
                </p>
                <Link to="/terapeutas" className="text-mystic-600 hover:text-mystic-700 font-medium">
                  Ver terapeutas →
                </Link>
              </div>
            </div>

            {/* Fundadora 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-64 bg-gradient-to-br from-mystic-600 via-primary-500 to-primary-400 relative overflow-hidden flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">C</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Celina</h3>
                <p className="text-gray-600 mb-4">
                  Co-fundadora de Ouro. Apasionada por el desarrollo humano y el acompañamiento terapéutico en cada etapa de la vida.
                </p>
                <Link to="/terapeutas" className="text-mystic-600 hover:text-mystic-700 font-medium">
                  Ver terapeutas →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. TERAPEUTAS ── */}
      <section id="terapeutas" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Terapeutas
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Especialistas seleccionados, comprometidos con tu bienestar y crecimiento personal
            </p>
          </div>

          {therapists.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {therapists.map((t) => (
                  <Link
                    key={t.id}
                    to={`/terapeutas/${t.id}`}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex items-center gap-4"
                  >
                    {t.photoUrl ? (
                      <img src={t.photoUrl} alt={t.userFullName} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-mystic-400 to-primary-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xl">{t.userFullName?.charAt(0)}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{t.userFullName}</p>
                      {t.specialty && (
                        <span className="inline-block mt-1 text-xs font-medium bg-mystic-100 text-mystic-700 px-2 py-0.5 rounded-full truncate max-w-full">
                          {t.specialty}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center">
                <Link
                  to="/terapeutas"
                  className="inline-block bg-gradient-to-r from-mystic-500 to-primary-600 text-white px-8 py-3 rounded-full hover:from-mystic-600 hover:to-primary-700 transition-all font-semibold shadow-md"
                >
                  Ver todos los terapeutas
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <Link
                to="/terapeutas"
                className="inline-block bg-gradient-to-r from-mystic-500 to-primary-600 text-white px-8 py-3 rounded-full hover:from-mystic-600 hover:to-primary-700 transition-all font-semibold shadow-md"
              >
                Explorar terapeutas
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. CÓMO EMPEZAR ── */}
      <section id="como-empezar" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cómo empezar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cinco simples pasos para comenzar tu proceso
            </p>
          </div>

          {/* 5 pasos */}
          <div className="relative mb-16">
            {/* Línea conectora (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-mystic-200 via-primary-300 to-mystic-200" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
              {PASOS.map((paso) => (
                <div key={paso.num} className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-mystic-100 to-primary-100 rounded-full flex items-center justify-center mx-auto ring-4 ring-white shadow-sm">
                      <div className="text-mystic-600">
                        {paso.icon}
                      </div>
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-mystic-500 to-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                      {paso.num}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{paso.titulo}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{paso.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4 características */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">100% Confidencial</h3>
              <p className="text-gray-600 text-sm">Tus sesiones son privadas y seguras, protegidas con cifrado de extremo a extremo.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-mystic-100 to-primary-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-mystic-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Terapeutas de Confianza</h3>
              <p className="text-gray-600 text-sm">Seleccionados cuidadosamente y acompañados por nuestro equipo en cada etapa.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-mystic-100 to-primary-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-mystic-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Horarios Disponibles</h3>
              <p className="text-gray-600 text-sm">Cada especialista gestiona su agenda. Elegí el horario que mejor te convenga.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Desde Casa</h3>
              <p className="text-gray-600 text-sm">Conectate desde cualquier lugar con nuestra plataforma de videollamadas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-mystic-600 via-primary-600 to-mystic-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Lista para descubrir tu camino?
          </h2>
          <p className="text-xl text-mystic-100 mb-8">
            Acompañamos a quienes eligen conocerse a sí mismos
          </p>
          <Link
            to="/login"
            className="inline-block bg-white text-mystic-600 px-8 py-4 rounded-full hover:bg-mystic-50 transition-colors font-semibold text-lg shadow-lg transform hover:scale-105"
          >
            Iniciar sesión
          </Link>
        </div>
      </section>

      {/* ── 5. CONTACTO ── */}
      <section id="contacto" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Tenés preguntas sobre la plataforma?
            </h2>
            <p className="text-xl text-gray-600">
              Escribinos aquí:
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                  rows={5}
                  placeholder="Describí tu consulta sobre la plataforma..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {contactStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  ¡Mensaje enviado! Te respondemos a la brevedad.
                </div>
              )}
              {contactStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  Hubo un error al enviar el mensaje. Completá todos los campos o escribinos directamente al correo.
                </div>
              )}

              <button
                type="submit"
                disabled={contactLoading}
                className="w-full bg-gradient-to-r from-mystic-500 to-primary-600 text-white py-3 rounded-lg hover:from-mystic-600 hover:to-primary-700 transition-all font-semibold text-lg disabled:opacity-50 shadow-md"
              >
                {contactLoading ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
