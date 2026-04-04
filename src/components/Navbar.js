import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllTherapists } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

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

  const handleTherapistClick = (therapistId) => {
    setDropdownOpen(false);
    setIsMenuOpen(false);
    navigate(`/terapeutas/${therapistId}`);
  };

  return (
    <>
    {confirmLogout && (
      <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-xs w-full">
          <h3 className="font-semibold text-gray-900 text-center mb-1">¿Cerrar sesión?</h3>
          <p className="text-sm text-gray-400 text-center mb-5">Tu sesión actual se cerrará.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmLogout(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    )}
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-mystic-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">URO</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('inicio')}
              className="text-gray-700 hover:text-mystic-600 transition-colors font-medium"
            >
              Inicio
            </button>

            <button
              onClick={() => scrollToSection('quienes-somos')}
              className="text-gray-700 hover:text-mystic-600 transition-colors font-medium"
            >
              Quiénes somos
            </button>

            {/* Terapeutas con dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1 text-gray-700 hover:text-mystic-600 transition-colors font-medium"
              >
                Terapeutas
                <svg
                  className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {/* Buscador */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Buscar terapeuta o especialidad..."
                        value={therapistSearch}
                        onChange={(e) => setTherapistSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Lista */}
                  <div className="max-h-64 overflow-y-auto">
                    {therapistLoading ? (
                      <div className="flex justify-center py-6">
                        <div className="w-5 h-5 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                      </div>
                    ) : filteredTherapists.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-6">
                        {therapistSearch ? 'Sin resultados' : 'No hay terapeutas disponibles'}
                      </p>
                    ) : (
                      filteredTherapists.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleTherapistClick(t.id)}
                          className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                        >
                          {t.photoUrl ? (
                            <img src={t.photoUrl} alt={t.userFullName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mystic-400 to-primary-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">{t.userFullName?.charAt(0)}</span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{t.userFullName}</p>
                            {t.specialty && (
                              <p className="text-xs text-gray-500 truncate">{t.specialty}</p>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Ver todos */}
                  <div className="p-3 border-t border-gray-100">
                    <Link
                      to="/terapeutas"
                      onClick={() => setDropdownOpen(false)}
                      className="block w-full text-center text-sm font-medium text-primary-600 hover:text-primary-700 py-1 transition-colors"
                    >
                      Ver todos los terapeutas →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {currentUser && (
              <>
                <Link
                  to="/biblioteca"
                  className="text-gray-700 hover:text-mystic-600 transition-colors font-medium"
                >
                  Biblioteca
                </Link>
                <Link
                  to="/formaciones"
                  className="text-gray-700 hover:text-mystic-600 transition-colors font-medium"
                >
                  Formaciones
                </Link>
              </>
            )}

            <button
              onClick={() => scrollToSection('como-empezar')}
              className="text-gray-700 hover:text-mystic-600 transition-colors font-medium"
            >
              Cómo empezar
            </button>

            <button
              onClick={() => scrollToSection('contacto')}
              className="text-gray-700 hover:text-mystic-600 transition-colors font-medium"
            >
              Contacto
            </button>

            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-mystic-600 transition-colors font-medium"
              >
                Panel Admin
              </Link>
            )}

            {currentUser ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-mystic-600 transition-colors font-medium"
                >
                  {firstName}
                </Link>
                <button
                  onClick={() => setConfirmLogout(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-all font-medium text-sm"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-mystic-500 to-primary-600 text-white px-6 py-2 rounded-full hover:from-mystic-600 hover:to-primary-700 transition-all transform hover:scale-105 font-medium shadow-md"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button onClick={() => scrollToSection('inicio')} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-mystic-50 hover:text-mystic-600 rounded-md font-medium">
              Inicio
            </button>
            <button onClick={() => scrollToSection('quienes-somos')} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-mystic-50 hover:text-mystic-600 rounded-md font-medium">
              Quiénes somos
            </button>
            <Link to="/terapeutas" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-mystic-50 hover:text-mystic-600 rounded-md font-medium">
              Terapeutas
            </Link>
            {currentUser && (
              <>
                <Link to="/biblioteca" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-mystic-50 hover:text-mystic-600 rounded-md font-medium">
                  Biblioteca de Alejandría
                </Link>
                <Link to="/formaciones" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-mystic-50 hover:text-mystic-600 rounded-md font-medium">
                  Formaciones
                </Link>
              </>
            )}
            <button onClick={() => scrollToSection('como-empezar')} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-mystic-50 hover:text-mystic-600 rounded-md font-medium">
              Cómo empezar
            </button>
            <button onClick={() => scrollToSection('contacto')} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-mystic-50 hover:text-mystic-600 rounded-md font-medium">
              Contacto
            </button>
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-mystic-50 hover:text-mystic-600 rounded-md font-medium">
                Panel Admin
              </Link>
            )}
            {currentUser ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-mystic-50 hover:text-mystic-600 rounded-md font-medium">
                  {firstName}
                </Link>
                <button onClick={() => setConfirmLogout(true)} className="block w-full text-left px-3 py-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-md font-medium">
                  Salir
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-3 py-2 bg-gradient-to-r from-mystic-500 to-primary-600 text-white rounded-md hover:from-mystic-600 hover:to-primary-700 font-medium">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
    </>
  );
};

export default Navbar;
