import React, { useState, useRef } from 'react';
import { uploadTherapistPhoto } from '../services/api';

const LEAD_TIME_OPTIONS = [
  { value: 1,   label: '1 hora' },
  { value: 2,   label: '2 horas' },
  { value: 4,   label: '4 horas' },
  { value: 6,   label: '6 horas' },
  { value: 12,  label: '12 horas' },
  { value: 24,  label: '24 horas (1 día)' },
  { value: 48,  label: '48 horas (2 días)' },
  { value: 72,  label: '72 horas (3 días)' },
  { value: 96,  label: '96 horas (4 días)' },
  { value: 120, label: '120 horas (5 días)' },
];

const TherapistForm = ({ initialValues = {}, onSubmit, saving, apiError, submitLabel = 'Guardar', userId, mpTokenConfigurado }) => {
  const [formData, setFormData] = useState({
    bio: initialValues.bio || '',
    specialty: initialValues.specialty || '',
    photoUrl: initialValues.photoUrl || '',
    precioEnPesos: initialValues.precioEnPesos || '',
    priceCurrency: initialValues.priceCurrency || 'ARS',
    mpAccessToken: '',
    minBookingLeadHours: initialValues.minBookingLeadHours || 1,
  });
  const [localError, setLocalError] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(initialValues.photoUrl || '');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.name === 'minBookingLeadHours' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setLocalError('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setLocalError('Solo se permiten archivos de imagen (JPG, PNG, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLocalError('La imagen no puede superar 5 MB');
      return;
    }
    setLocalError('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.bio.trim() || !formData.specialty.trim() || !formData.precioEnPesos) {
      setLocalError('Completá los campos obligatorios');
      return;
    }

    const precio = parseFloat(formData.precioEnPesos);
    if (isNaN(precio) || precio <= 0) {
      setLocalError('El precio debe ser un número mayor a 0');
      return;
    }

    let finalPhotoUrl = formData.photoUrl;

    if (photoFile) {
      setUploadingPhoto(true);
      try {
        const result = await uploadTherapistPhoto(photoFile);
        finalPhotoUrl = result.photoUrl;
      } catch (err) {
        setLocalError(err.response?.data?.message || 'Error al subir la foto');
        setUploadingPhoto(false);
        return;
      } finally {
        setUploadingPhoto(false);
      }
    }

    const payload = {
      bio: formData.bio,
      specialty: formData.specialty,
      photoUrl: finalPhotoUrl || null,
      priceAmountCents: Math.round(precio * 100),
      priceCurrency: formData.priceCurrency,
      minBookingLeadHours: formData.minBookingLeadHours,
    };

    if (formData.mpAccessToken.trim()) {
      payload.mpAccessToken = formData.mpAccessToken.trim();
    }

    onSubmit(payload);
  };

  const displayError = localError || apiError;
  const isWorking = saving || uploadingPhoto;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {displayError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {displayError}
        </div>
      )}

      <div>
        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
          Especialidad <span className="text-red-500">*</span>
        </label>
        <input
          id="specialty"
          name="specialty"
          type="text"
          required
          value={formData.specialty}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          placeholder="Ej: Astrología, Tarot, Reiki"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          Bio profesional <span className="text-red-500">*</span>
        </label>
        <textarea
          id="bio"
          name="bio"
          required
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
          placeholder="Contá tu experiencia, formación y enfoque de trabajo..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="precioEnPesos" className="block text-sm font-medium text-gray-700 mb-2">
            Precio por sesión <span className="text-red-500">*</span>
          </label>
          <input
            id="precioEnPesos"
            name="precioEnPesos"
            type="number"
            required
            min="1"
            step="1"
            value={formData.precioEnPesos}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="5000"
          />
        </div>
        <div>
          <label htmlFor="priceCurrency" className="block text-sm font-medium text-gray-700 mb-2">
            Moneda
          </label>
          <select
            id="priceCurrency"
            name="priceCurrency"
            value={formData.priceCurrency}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
          >
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      {/* Anticipo mínimo para reservas */}
      <div>
        <label htmlFor="minBookingLeadHours" className="block text-sm font-medium text-gray-700 mb-1">
          Anticipación mínima para reservar <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Los clientes solo podrán reservar turnos con al menos esta anticipación.
        </p>
        <select
          id="minBookingLeadHours"
          name="minBookingLeadHours"
          value={formData.minBookingLeadHours}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
        >
          {LEAD_TIME_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Mercado Pago */}
      <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="mpAccessToken" className="block text-sm font-semibold text-amber-900">
            Token de Mercado Pago <span className="text-gray-400 font-normal text-xs">(recomendado)</span>
          </label>
          {mpTokenConfigurado && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Configurado
            </span>
          )}
        </div>
        <p className="text-xs text-amber-800 mb-2">
          Pegá tu <strong>Access Token de producción</strong> de Mercado Pago para recibir los pagos de tus clientes directamente en tu cuenta.
          Encontralo en <em>mpago.com/developers → Tu aplicación → Credenciales de producción</em>.
          {mpTokenConfigurado ? ' Dejá en blanco para conservar el token actual.' : ' Sin token, los clientes no podrán pagarte online.'}
        </p>
        <input
          id="mpAccessToken"
          name="mpAccessToken"
          type="password"
          value={formData.mpAccessToken}
          onChange={handleChange}
          autoComplete="new-password"
          className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all font-mono text-sm bg-white"
          placeholder="APP_USR-..."
        />
      </div>

      {/* Foto de perfil */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Foto de perfil <span className="text-gray-400">(opcional)</span>
        </label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-mystic-400 to-primary-500 flex items-center justify-center flex-shrink-0 ring-2 ring-gray-100">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors text-center"
            >
              {photoPreview ? 'Cambiar foto' : 'Subir foto'}
            </button>
            {photoPreview && (
              <button
                type="button"
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoPreview('');
                  setFormData((prev) => ({ ...prev, photoUrl: '' }));
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="mt-1 w-full text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Quitar foto
              </button>
            )}
            <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP · Máx. 5 MB</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

      <button
        type="submit"
        disabled={isWorking}
        className="w-full bg-gradient-to-r from-mystic-500 to-primary-600 text-white py-3 rounded-lg hover:from-mystic-600 hover:to-primary-700 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        {uploadingPhoto ? 'Subiendo foto...' : saving ? 'Guardando...' : submitLabel}
      </button>
    </form>
  );
};

export default TherapistForm;
