import React, { useState, useRef } from 'react';
import { uploadTherapistPhoto } from '../services/api';

// ---------------------------------------------------------------
// Iconos inline — stroke 1.5px.
// Pendiente reemplazar por lucide-react al sumar la dependencia.
// ---------------------------------------------------------------
const AlertCircle = ({ className = '', style }) => (
  <svg className={className} style={style} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const UserIcon = ({ className = '' }) => (
  <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PlusIcon = ({ className = '' }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

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
    precioEnPesos: initialValues.precioEnPesos || '',
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

    onSubmit({
      bio: formData.bio,
      specialty: formData.specialty,
      photoUrl: finalPhotoUrl || null,
      priceAmountCents: Math.round(precio * 100),
      priceCurrency: formData.priceCurrency,
      minBookingLeadHours: formData.minBookingLeadHours,
      specialties: specialties.length > 0 ? specialties : null,
    });
  };

  const displayError = localError || apiError;
  const isWorking = saving || uploadingPhoto;

  // Clases reutilizables
  const labelClass = 'block font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold mb-3';
  const inputClass = 'w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white placeholder:text-white-faint placeholder:italic py-3 transition-colors duration-300';
  const selectClass = 'w-full bg-transparent border-0 border-b border-gold-faint focus:border-gold focus:outline-none font-serif font-light text-lg text-white py-3 transition-colors duration-300 cursor-pointer';

  return (
    <form onSubmit={handleSubmit} className="space-y-10">

      {/* Banner error (terracota) */}
      {displayError && (
        <div
          className="px-5 py-4 flex items-start gap-3"
          style={{
            borderTop: '1px solid rgba(160, 74, 58, 0.4)',
            borderBottom: '1px solid rgba(160, 74, 58, 0.4)',
            background: 'rgba(160, 74, 58, 0.08)',
          }}
          role="alert"
        >
          <AlertCircle className="flex-shrink-0 mt-0.5" style={{ color: '#A04A3A' }} />
          <p className="font-serif font-light text-base leading-relaxed" style={{ color: '#A04A3A' }}>
            {displayError}
          </p>
        </div>
      )}

      {/* Especialidad principal */}
      <div>
        <label htmlFor="specialty" className={labelClass}>
          Especialidad principal
        </label>
        <input
          id="specialty"
          name="specialty"
          type="text"
          required
          value={formData.specialty}
          onChange={handleChange}
          placeholder="Astrología, tarot, reiki, otra"
          className={inputClass}
          style={{ colorScheme: 'dark' }}
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className={labelClass}>
          Bio profesional
        </label>
        <textarea
          id="bio"
          name="bio"
          required
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          placeholder="Contá tu experiencia, formación y enfoque de trabajo"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Precio + Moneda */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="sm:col-span-2">
          <label htmlFor="precioEnPesos" className={labelClass}>
            Precio por sesión
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
            placeholder="5000"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="priceCurrency" className={labelClass}>
            Moneda
          </label>
          <select
            id="priceCurrency"
            name="priceCurrency"
            value={formData.priceCurrency}
            onChange={handleChange}
            style={{ colorScheme: 'dark' }}
            className={selectClass}
          >
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      {/* Anticipación mínima */}
      <div>
        <label htmlFor="minBookingLeadHours" className={labelClass}>
          Anticipación mínima para reservar
        </label>
        <select
          id="minBookingLeadHours"
          name="minBookingLeadHours"
          value={formData.minBookingLeadHours}
          onChange={handleChange}
          style={{ colorScheme: 'dark' }}
          className={selectClass}
        >
          {LEAD_TIME_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <p className="font-serif italic font-light text-sm text-white-faint mt-3">
          Los clientes solo podrán reservar con al menos esta anticipación.
        </p>
      </div>

      {/* Foto de perfil */}
      <div>
        <div className="flex items-baseline gap-3 mb-3">
          <label className={`${labelClass} mb-0`}>
            Foto de perfil
          </label>
          <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
            Opcional
          </span>
        </div>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border border-gold-faint flex items-center justify-center bg-navy-soft/40">
            {photoPreview ? (
              <img src={photoPreview} alt="Vista previa" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="text-gold-dim" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out"
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
                className="mt-2 w-full font-sans text-[10px] uppercase tracking-eyebrow hover:opacity-80 transition-opacity duration-300"
                style={{ color: '#A04A3A' }}
              >
                Quitar foto
              </button>
            )}
            <p className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint mt-2">
              JPG, PNG o WebP · Máximo 5 MB
            </p>
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

      {/* Especialidades adicionales */}
      <div className="pt-2">
        <div className="flex items-baseline gap-3 mb-3">
          <label className={`${labelClass} mb-0`}>
            Especialidades adicionales
          </label>
          <span className="font-sans text-[10px] uppercase tracking-eyebrow text-white-faint">
            Opcional
          </span>
        </div>
        <p className="font-serif italic font-light text-sm text-white-faint mb-5">
          Si ofrecés distintos tipos de sesión con diferente anticipación, agregalas acá.
        </p>

        {/* Lista de especialidades ya agregadas */}
        {specialties.length > 0 && (
          <ul className="space-y-2 mb-5">
            {specialties.map((sp, i) => (
              <li
                key={i}
                className="flex items-center gap-4 px-4 py-3 border border-gold-faint bg-navy-soft/30"
              >
                <span className="flex-1 font-serif font-normal text-base text-white truncate">
                  {sp.name}
                </span>
                <span className="font-sans text-[10px] uppercase tracking-eyebrow text-gold-dim flex-shrink-0">
                  {sp.minBookingLeadHours}h
                </span>
                <button
                  type="button"
                  onClick={() => setSpecialties(specialties.filter((_, j) => j !== i))}
                  className="font-sans text-[10px] uppercase tracking-eyebrow hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
                  style={{ color: '#A04A3A' }}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Inputs para agregar nueva especialidad */}
        <div className="space-y-4 border-t border-gold-faint pt-5">
          <input
            type="text"
            value={newSpecName}
            onChange={(e) => setNewSpecName(e.target.value)}
            placeholder="Carta natal, lecturas de tarot, otra"
            className={inputClass}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={newSpecLeadHours}
              onChange={(e) => setNewSpecLeadHours(Number(e.target.value))}
              style={{ colorScheme: 'dark' }}
              className={`${selectClass} sm:flex-1`}
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
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-gold-dim hover:bg-gold hover:border-gold hover:text-navy font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold transition-all duration-400 ease-expo-out flex-shrink-0"
            >
              <PlusIcon />
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submit — acción crítica única del form: gold-gradient */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isWorking}
          className="w-full inline-flex items-center justify-center gap-3 bg-gold-gradient py-4 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-navy transition-all duration-400 ease-expo-out hover:-translate-y-0.5 hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          <span>
            {uploadingPhoto ? 'Subiendo foto...' : saving ? 'Guardando...' : submitLabel}
          </span>
          {!isWorking && <span>→</span>}
        </button>
      </div>

    </form>
  );
};

export default TherapistForm;
