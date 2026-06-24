import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as Isotipo } from '../assets/logo/ouro-isotipo.svg';
import { getAllTherapists } from '../services/api';

// ---------------------------------------------------------------
// Iconos inline (stroke 1.5px, color current).
// Pendiente: reemplazar por lucide-react cuando se sume la dependencia.
// ---------------------------------------------------------------
const ChevronDown = ({ className = '' }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SearchIcon = ({ className = '' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MenuIcon = ({ className = '' }) => (
  <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

const CloseIcon = ({ className = '' }) => (
  <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
);

// ---------------------------------------------------------------
// NavLink: link con underline dorado animado en hover.
// ---------------------------------------------------------------
const NavLink = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="group relative font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-dim hover:text-gold transition-colors duration-300 py-2"
  >
    {children}
    <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-expo-out" />
  </button>
);

const NavLinkAsLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="group relative font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-dim hover:text-gold transition-colors duration-300 py-2"
  >
    {children}
    <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-expo-out" />
  </Link>
);

// ---------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------
const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Dropdown terapeutas
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [therapistList, setTherapistList] = useState([]);
  const [therapistLoading, setTherapistLoading] = useState(false);
  const [therapistSearch, setTherapistSearch] = useState('');
  const dropdownRef = useRef(null);

  const userData = localStorage.getItem('ouro_user');
  let currentUser = null;
  try {
    currentUser = userData ? JSON.parse(userData) : null;
  } catch {
    localStorage.removeItem('ouro_user');
  }
  const isAdmin = currentUser?.role === 'ADMIN';
  const firstName = currentUser?.fullName?.split(' ')[0] || null;

  // Efecto scroll → cambia fondo de la nav
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Cargar terapeutas la primera vez que se abre el dropdown
  useEffect(() => {
    if (!dropdownOpen || therapistList.length > 0) return;
    setTherapistLoading(true);
    getAllTherapists()
      .then((data) => {
        const sorted = [...data].sort((a, b) =>
          a.userFullName.localeCompare(b.userFullName, 'es')
        );
        setTherapistList(sorted);
      })
      .catch(() => {})
      .finally(() => setTherapistLoading(false));
  }, [dropdownOpen, therapistList.length]);

  const filteredTherapists = therapistList.filter((t) => {
    if (!therapistSearch) return true;
    const q = therapistSearch.toLowerCase();
    return (
      t.userFullName.toLowerCase().includes(q) ||
      (t.specialty && t.specialty.toLowerCase().includes(q))
    );
  });

  const handleLogout = () => {
    setConfirmLogout(false);
    localStorage.removeItem('ouro_user');
    setIsMenuOpen(false);
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
    setIsMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleTherapistClick = (therapistSlug) => {
    setDropdownOpen(false);
    setIsMenuOpen(false);
    navigate(`/terapeutas/${therapistSlug}`);
  };

  return (
    <>
      {/* =======================================================
          MODAL — Confirmación de logout
          ======================================================= */}
      {confirmLogout && (
        <div className="ouro-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-sm">
          <div className="ouro-modal w-full max-w-sm bg-navy-card border border-gold-faint p-8 shadow-card-hover">
            <h3 className="font-serif text-2xl font-light text-white text-center mb-2">
              ¿Cerrar sesión?
            </h3>
            <p className="font-serif text-base text-white-dim text-center mb-8 leading-relaxed">
              Tu sesión actual se cerrará.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 py-3 border border-gold-faint hover:border-gold-dim font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-dim hover:text-white transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-gold-gradient hover:-translate-y-0.5 hover:shadow-gold-glow font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-300 ease-expo-out"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          NAV principal
          ======================================================= */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-expo-out ${
          scrolled
            ? 'bg-navy/[0.88] backdrop-blur-xl border-b border-gold-faint'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-container mx-auto px-6 lg:px-10">
          <div className="relative flex items-center h-20">

            {/* ---------- Logo — centrado en mobile, a la izquierda en desktop ---------- */}
            <Link
              to="/"
              className="group absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex items-center gap-3 text-gold"
              aria-label="OURO — Inicio"
            >
              <Isotipo
                className="h-11 w-11 md:h-11 md:w-11 text-gold transition-transform duration-600 ease-expo-out group-hover:rotate-[15deg]"
                aria-hidden="true"
              />
              <span
                className="hidden sm:inline font-serif text-xl font-normal tracking-brand text-white"
                style={{ paddingRight: '0.45em' }}
              >
                OURO
              </span>
            </Link>

            {/* ---------- Menú desktop ---------- */}
            <div className="hidden lg:flex flex-1 justify-end items-center gap-8">
              <NavLink onClick={() => scrollToSection('inicio')}>Inicio</NavLink>
              <NavLink onClick={() => scrollToSection('quienes-somos')}>Quiénes somos</NavLink>

              {/* Dropdown terapeutas */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="group relative flex items-center gap-1.5 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-white-dim hover:text-gold transition-colors duration-300 py-2"
                >
                  Terapeutas
                  <ChevronDown
                    className={`transition-transform duration-400 ease-expo-out ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                  <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gold origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-600 ease-expo-out" />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-80 bg-navy/[0.96] backdrop-blur-xl border border-gold-faint shadow-card-hover overflow-hidden">
                    {/* Buscador (caja completa — excepción del design system) */}
                    <div className="p-4 border-b border-gold-faint">
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-dim" />
                        <input
                          type="text"
                          placeholder="Buscar terapeuta o especialidad..."
                          value={therapistSearch}
                          onChange={(e) => setTherapistSearch(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 bg-navy-soft/40 border border-gold-faint focus:border-gold-dim font-serif text-sm text-white placeholder:text-white-faint placeholder:italic outline-none transition-colors duration-300"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Lista */}
                    <div className="max-h-72 overflow-y-auto py-2">
                      {therapistLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="w-5 h-5 border-2 border-gold-faint border-t-gold rounded-full animate-spin" />
                        </div>
                      ) : filteredTherapists.length === 0 ? (
                        <p className="font-serif text-sm text-white-faint italic text-center py-8">
                          {therapistSearch ? 'Sin resultados' : 'No hay terapeutas disponibles'}
                        </p>
                      ) : (
                        filteredTherapists.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => handleTherapistClick(t.slug)}
                            className="w-full text-left px-5 py-3 hover:bg-gold-ghost transition-colors duration-300 flex items-center gap-3"
                          >
                            {t.photoUrl ? (
                              <img
                                src={t.photoUrl}
                                alt={t.userFullName}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gold-faint"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                                <span className="font-serif text-base font-normal text-navy">
                                  {t.userFullName?.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-serif text-base text-white truncate leading-tight">
                                {t.userFullName}
                              </p>
                              {(t.specialties?.length > 0 || t.specialty) && (
                                <p className="font-sans text-[10px] uppercase tracking-dropdown text-white-faint truncate mt-1">
                                  {t.specialties?.[0]?.name || t.specialty}
                                </p>
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Ver todos */}
                    <div className="border-t border-gold-faint px-5 py-3">
                      <Link
                        to="/terapeutas"
                        onClick={() => setDropdownOpen(false)}
                        className="group flex items-center justify-center gap-2 font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold hover:text-gold-bright transition-colors duration-300"
                      >
                        <span>Ver todos los terapeutas</span>
                        <span className="transition-transform duration-400 ease-expo-out group-hover:translate-x-2">→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {currentUser && (
                <>
                  <NavLinkAsLink to="/biblioteca">Biblioteca</NavLinkAsLink>
                  <NavLinkAsLink to="/formaciones">Formaciones</NavLinkAsLink>
                </>
              )}

              <NavLink onClick={() => scrollToSection('como-empezar')}>Cómo empezar</NavLink>
              <NavLink onClick={() => scrollToSection('contacto')}>Contacto</NavLink>

              {isAdmin && (
                <NavLinkAsLink to="/admin">Panel admin</NavLinkAsLink>
              )}

              {/* CTA outline */}
              {currentUser ? (
                <div className="flex items-center gap-4 pl-4 border-l border-gold-faint">
                  <Link
                    to="/dashboard"
                    className="font-serif text-base text-white-dim hover:text-gold transition-colors duration-300"
                  >
                    {firstName}
                  </Link>
                  <button
                    onClick={() => setConfirmLogout(true)}
                    className="px-5 py-2.5 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-300 ease-expo-out"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2.5 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-300 ease-expo-out"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>

            {/* ---------- Botón mobile menu ---------- */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden ml-auto text-gold hover:text-gold-bright transition-colors duration-300"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* =======================================================
          DRAWER mobile
          ======================================================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="ouro-backdrop absolute inset-0 bg-navy-deep/80 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <aside className="ouro-drawer absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-navy-deep border-l border-gold-faint shadow-card-hover overflow-y-auto">
            <div className="px-8 pt-24 pb-10 space-y-1">
              <MobileItem onClick={() => scrollToSection('inicio')}>Inicio</MobileItem>
              <MobileItem onClick={() => scrollToSection('quienes-somos')}>Quiénes somos</MobileItem>
              <MobileItem onClick={() => { setIsMenuOpen(false); navigate('/terapeutas'); }}>Terapeutas</MobileItem>

              {currentUser && (
                <>
                  <MobileItem onClick={() => { setIsMenuOpen(false); navigate('/biblioteca'); }}>Biblioteca</MobileItem>
                  <MobileItem onClick={() => { setIsMenuOpen(false); navigate('/formaciones'); }}>Formaciones</MobileItem>
                </>
              )}

              <MobileItem onClick={() => scrollToSection('como-empezar')}>Cómo empezar</MobileItem>
              <MobileItem onClick={() => scrollToSection('contacto')}>Contacto</MobileItem>

              {isAdmin && (
                <MobileItem onClick={() => { setIsMenuOpen(false); navigate('/admin'); }}>Panel admin</MobileItem>
              )}

              {/* Divisor dorado tipo línea-gradiente */}
              <div className="my-6 h-px bg-gradient-to-r from-transparent via-gold-dim to-transparent" />

              {currentUser ? (
                <>
                  <MobileItem onClick={() => { setIsMenuOpen(false); navigate('/dashboard'); }}>
                    {firstName || 'Mi cuenta'}
                  </MobileItem>
                  <button
                    onClick={() => { setIsMenuOpen(false); setConfirmLogout(true); }}
                    className="w-full mt-4 py-3 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-300"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full mt-4 py-3 bg-gold-gradient text-center font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-300"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>

            {/* Marca vertical en el lateral inferior del drawer */}
            <div className="absolute bottom-6 left-8 font-serif text-[10px] tracking-brand uppercase text-white-faint">
              OURO
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------
// MobileItem — item del drawer mobile
// ---------------------------------------------------------------
const MobileItem = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="block w-full text-left py-3 font-serif text-xl font-light text-white-dim hover:text-gold active:text-gold transition-colors duration-300"
  >
    {children}
  </button>
);

export default Navbar;
