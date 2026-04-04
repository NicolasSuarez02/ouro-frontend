import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-mystic-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-2xl font-bold">URO</span>
          </div>

          {/* Email secundario */}
          <a
            href="mailto:contactoouro@gmail.com"
            className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
          >
            contactoouro@gmail.com
          </a>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Ouro. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
