import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingTherapists, approveTherapist, rejectTherapist, getPendingResources, approveResource, rejectResource } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('terapeutas');
  const [therapists, setTherapists] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFeedback, setActionFeedback] = useState({});
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('ouro_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userData);
    if (user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    setAdmin(user);
  }, [navigate]);

  useEffect(() => {
    if (admin) {
      cargarPendientes();
      cargarRecursosPendientes();
    }
  }, [admin]);

  const cargarPendientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingTherapists(admin.id);
      setTherapists(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar terapeutas pendientes');
    } finally {
      setLoading(false);
    }
  };

  const cargarRecursosPendientes = async () => {
    try {
      const data = await getPendingResources(admin.id);
      setRecursos(data);
    } catch (err) {
      // silencioso, el error principal ya lo muestra cargarPendientes
    }
  };

  const handleApproveResource = async (resourceId) => {
    setActionFeedback((prev) => ({ ...prev, [`r${resourceId}`]: { loading: true } }));
    try {
      await approveResource(resourceId, admin.id);
      setActionFeedback((prev) => ({ ...prev, [`r${resourceId}`]: { success: 'Aprobado' } }));
      setRecursos((prev) => prev.filter((r) => r.id !== resourceId));
    } catch (err) {
      setActionFeedback((prev) => ({
        ...prev,
        [`r${resourceId}`]: { error: err.response?.data?.message || 'Error al aprobar' },
      }));
    }
  };

  const handleRejectResource = async (resourceId) => {
    setActionFeedback((prev) => ({ ...prev, [`r${resourceId}`]: { loading: true } }));
    try {
      await rejectResource(resourceId, admin.id);
      setActionFeedback((prev) => ({ ...prev, [`r${resourceId}`]: { success: 'Rechazado' } }));
      setRecursos((prev) => prev.filter((r) => r.id !== resourceId));
    } catch (err) {
      setActionFeedback((prev) => ({
        ...prev,
        [`r${resourceId}`]: { error: err.response?.data?.message || 'Error al rechazar' },
      }));
    }
  };

  const handleApprove = async (therapistId) => {
    setActionFeedback((prev) => ({ ...prev, [therapistId]: { loading: true } }));
    try {
      await approveTherapist(therapistId, admin.id);
      setActionFeedback((prev) => ({ ...prev, [therapistId]: { success: 'Aprobado' } }));
      setTherapists((prev) => prev.filter((t) => t.id !== therapistId));
    } catch (err) {
      setActionFeedback((prev) => ({
        ...prev,
        [therapistId]: { error: err.response?.data?.message || 'Error al aprobar' },
      }));
    }
  };

  const handleReject = async (therapistId) => {
    setActionFeedback((prev) => ({ ...prev, [therapistId]: { loading: true } }));
    try {
      await rejectTherapist(therapistId, admin.id);
      setActionFeedback((prev) => ({ ...prev, [therapistId]: { success: 'Rechazado' } }));
      setTherapists((prev) => prev.filter((t) => t.id !== therapistId));
    } catch (err) {
      setActionFeedback((prev) => ({
        ...prev,
        [therapistId]: { error: err.response?.data?.message || 'Error al rechazar' },
      }));
    }
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-mystic-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Panel de administración</span>
          </div>
          <span className="text-sm text-gray-500">{admin.email}</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setTab('terapeutas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'terapeutas' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Terapeutas {therapists.length > 0 && <span className="ml-1 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">{therapists.length}</span>}
          </button>
          <button
            onClick={() => setTab('recursos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'recursos' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Recursos {recursos.length > 0 && <span className="ml-1 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">{recursos.length}</span>}
          </button>
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Tab terapeutas */}
        {tab === 'terapeutas' && !loading && !error && therapists.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No hay terapeutas pendientes de aprobación.
          </div>
        )}

        <div className="space-y-4">
          {tab === 'terapeutas' && therapists.map((therapist) => {
            const feedback = actionFeedback[therapist.id];
            return (
              <div
                key={therapist.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {therapist.photoUrl ? (
                        <img
                          src={therapist.photoUrl}
                          alt={therapist.userFullName}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mystic-400 to-primary-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {therapist.userFullName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h2 className="font-semibold text-gray-900">{therapist.userFullName}</h2>
                        <p className="text-sm text-gray-500">{therapist.userEmail}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                      {therapist.specialty && (
                        <span>
                          <span className="font-medium">Especialidad:</span> {therapist.specialty}
                        </span>
                      )}
                      {therapist.priceAmountCents != null && (
                        <span>
                          <span className="font-medium">Precio:</span>{' '}
                          {(therapist.priceAmountCents / 100).toLocaleString('es-AR', {
                            style: 'currency',
                            currency: therapist.priceCurrency || 'ARS',
                          })}
                        </span>
                      )}
                    </div>

                    {therapist.bio && (
                      <p className="text-sm text-gray-500 line-clamp-2">{therapist.bio}</p>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {feedback?.loading && (
                      <span className="text-sm text-gray-400">Procesando...</span>
                    )}
                    {feedback?.success && (
                      <span className="text-sm text-green-600 font-medium">{feedback.success}</span>
                    )}
                    {feedback?.error && (
                      <span className="text-sm text-red-600">{feedback.error}</span>
                    )}
                    {!feedback && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(therapist.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleReject(therapist.id)}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab recursos */}
        {tab === 'recursos' && !loading && recursos.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No hay recursos pendientes de aprobación.
          </div>
        )}

        <div className="space-y-4">
          {tab === 'recursos' && recursos.map((recurso) => {
            const feedback = actionFeedback[`r${recurso.id}`];
            return (
              <div key={recurso.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        recurso.category === 'BIBLIOTECA'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {recurso.category === 'BIBLIOTECA' ? 'Biblioteca' : 'Formaciones'}
                      </span>
                    </div>
                    <h2 className="font-semibold text-gray-900">{recurso.title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Subido por {recurso.uploadedByName}</p>
                    {recurso.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{recurso.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{recurso.originalFileName}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {feedback?.loading && <span className="text-sm text-gray-400">Procesando...</span>}
                    {feedback?.success && <span className="text-sm text-green-600 font-medium">{feedback.success}</span>}
                    {feedback?.error && <span className="text-sm text-red-600">{feedback.error}</span>}
                    {!feedback && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveResource(recurso.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleRejectResource(recurso.id)}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
