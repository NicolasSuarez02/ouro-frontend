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

const TherapistForm = ({ initialValues = {}, onSubmit, saving, apiError, submitLabel = 'Guardar', userId }) => {
  const [formData, setFormData] = useState({
    bio: initialValues.bio || '',
    specialty: initialValues.specialty || '',
    photoUrl: initialValues.photoUrl || '',
    priceInCurrency: initialValues.priceInCurrency || '',
    priceCurrency: initialValues.priceCurrency || 'ARS',
    minBookingLeadHours: initialValues.minBookingLeadHours || 1,
  });
  const [specialties, setSpecialties] = useState(initialValues.specialties || []);
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecLeadHours, setNewSpecLeadHours] = useState(1);
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

    if (!formData.bio.trim() || !formData.specialty.trim() || !formData.priceInCurrency) {
      setLocalError('Completá los campos obligatorios');
      return;
    }

    const price = parseFloat(formData.priceInCurrency);
    if (isNaN(price) || price <= 0) {
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

    onSubmit({
      bio: formData.bio,
      specialty: formData.specialty,
      photoUrl: finalPhotoUrl || null,
      priceAmountCents: Math.round(price * 100),
      priceCurrency: formData.priceCurrency,
      minBookingLeadHours: formData.minBookingLeadHours,
      specialties: specialties.length > 0 ? specialties : null,
    });
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
          <label htmlFor="priceInCurrency" className="block text-sm font-medium text-gray-700 mb-2">
            Precio por sesión <span className="text-red-500">*</span>
          </label>
          <input
            id="priceInCurrency"
            name="priceInCurrency"
            type="number"
            required
            min="1"
            step="1"
            value={formData.priceInCurrency}
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


      {/* Especialidades adicionales (opcional, para terapeutas con múltiples tipos de sesión) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Especialidades adicionales <span className="text-gray-400">(opcional)</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Si ofrecés distintos tipos de sesión con diferente anticipación requerida, agregalas acá.
        </p>
        {specialties.length > 0 && (
          <div className="space-y-2 mb-3">
            {specialties.map((sp, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                <span className="flex-1 text-sm text-gray-800 font-medium">{sp.name}</span>
                <span className="text-xs text-gray-400">{sp.minBookingLeadHours}h</span>
                <button
                  type="button"
                  onClick={() => setSpecialties(specialties.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-600 text-xs ml-2"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-2">
          <input
            type="text"
            value={newSpecName}
            onChange={(e) => setNewSpecName(e.target.value)}
            placeholder="Ej: Carta natal, Lecturas de tarot"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <select
              value={newSpecLeadHours}
              onChange={(e) => setNewSpecLeadHours(Number(e.target.value))}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
            >
              {LEAD_TIME_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                if (!newSpecName.trim()) return;
                setSpecialties([...specialties, { name: newSpecName.trim(), minBookingLeadHours: newSpecLeadHours }]);
                setNewSpecName('');
                setNewSpecLeadHours(1);
              }}
              className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors flex-shrink-0"
            >
              + Agregar
            </button>
          </div>
        </div>
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
