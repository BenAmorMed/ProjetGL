import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VoeuService from '../services/voeu.service';
import SeanceService from '../services/seance.service';
import AuthService from '../services/auth.service';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, PlusCircle } from '../components/icons';

const VoeuxPage = () => {
    const [myVoeux, setMyVoeux] = useState([]);
    const [seances, setSeances] = useState([]);
    const [activeTab, setActiveTab] = useState('my'); // 'my' or 'available'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }
        setCurrentUser(user);
        loadData();
    }, [navigate]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [voeuxData, seancesData] = await Promise.all([
                VoeuService.getMesVoeux(),
                SeanceService.getAllSeances()
            ]);
            setMyVoeux(voeuxData);
            setSeances(seancesData);
        } catch (err) {
            console.error("Failed to load data", err);
            setError("Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    const handleExprimerVoeu = async (seanceId) => {
        try {
            // Assuming currentUser has an id. If not, we might need to fetch it or rely on backend to infer from token (which we implemented!)
            // But the exprimerVoeu service expects enseignantId. 
            // Wait, the backend VoeuController.exprimerVoeu takes a map with enseignantId.
            // And my fix in VoeuController.getMesVoeux infers ID from token.
            // But exprimerVoeu endpoint still expects enseignantId in the body.
            // I should probably update the backend to infer it too, but for now let's send it if we have it.
            // If AuthService.getCurrentUser() returns the user object with ID, we are good.

            if (!currentUser || !currentUser.id) {
                setError("User information missing. Please login again.");
                return;
            }

            await VoeuService.exprimerVoeu(currentUser.id, seanceId, "Je suis intéressé");
            setSuccess('Vœu exprimé avec succès !');
            setTimeout(() => setSuccess(''), 3000);
            loadData();
        } catch (err) {
            setError(err.response?.data?.error || 'Échec lors de l\'expression du vœu.');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleAnnulerVoeu = async (voeuId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir annuler ce vœu ?')) return;

        try {
            if (!currentUser || !currentUser.id) {
                setError("User information missing. Please login again.");
                return;
            }

            await VoeuService.annulerVoeu(voeuId, currentUser.id);
            setSuccess('Vœu annulé avec succès !');
            setTimeout(() => setSuccess(''), 3000);
            loadData();
        } catch (err) {
            setError(err.response?.data?.error || 'Échec lors de l\'annulation du vœu.');
            setTimeout(() => setError(''), 3000);
        }
    };

    // Filter sessions that don't have a wish yet
    const availableSeances = seances.filter(seance =>
        !myVoeux.some(voeu => voeu.seance && voeu.seance.id === seance.id)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                                <span className="text-xl">✨</span>
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Mes Vœux de Surveillance
                            </h1>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transform transition-all duration-300 hover:shadow-lg"
                        >
                            ← Retour au tableau de bord
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-fade-in">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                            <p className="text-green-700 font-medium">{success}</p>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'my'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Mes Vœux ({myVoeux.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'available'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Séances Disponibles ({availableSeances.length})
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {activeTab === 'my' ? (
                            myVoeux.length === 0 ? (
                                <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                                    <div className="text-6xl mb-4">📭</div>
                                    <h3 className="text-xl font-bold text-gray-700">Aucun vœu exprimé</h3>
                                    <p className="text-gray-500 mt-2">Consultez l'onglet "Séances Disponibles" pour exprimer vos préférences.</p>
                                </div>
                            ) : (
                                myVoeux.map((voeu) => (
                                    <VoeuCard
                                        key={voeu.id}
                                        voeu={voeu}
                                        type="my"
                                        onAction={handleAnnulerVoeu}
                                    />
                                ))
                            )
                        ) : (
                            availableSeances.length === 0 ? (
                                <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                                    <div className="text-6xl mb-4">✨</div>
                                    <h3 className="text-xl font-bold text-gray-700">Aucune séance disponible</h3>
                                    <p className="text-gray-500 mt-2">Revenez plus tard pour de nouvelles opportunités.</p>
                                </div>
                            ) : (
                                availableSeances.map((seance) => (
                                    <SeanceCard
                                        key={seance.id}
                                        seance={seance}
                                        onAction={handleExprimerVoeu}
                                    />
                                ))
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const VoeuCard = ({ voeu, onAction }) => {
    const seance = voeu.seance || {};
    const matiere = seance.matiere || {};
    const horaire = seance.horaire || {};

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACCEPTE': return 'bg-green-100 text-green-700';
            case 'REFUSE': return 'bg-red-100 text-red-700';
            case 'ANNULE': return 'bg-gray-100 text-gray-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(voeu.statut)}`}>
                            {voeu.statut}
                        </span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-500 text-sm font-medium">Vœu #{voeu.id}</span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-1">{matiere.nom || 'Matière inconnue'}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center text-gray-700">
                            <Calendar className="w-5 h-5 text-indigo-500 mr-3" />
                            <span className="font-medium">{seance.date}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Clock className="w-5 h-5 text-purple-500 mr-3" />
                            <span className="font-medium">{horaire.heure} - {horaire.hfin}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    {voeu.statut === 'EN_ATTENTE' && (
                        <button
                            onClick={() => onAction(voeu.id)}
                            className="w-full md:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        >
                            <XCircle className="w-5 h-5" />
                            Annuler
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const SeanceCard = ({ seance, onAction }) => {
    const matiere = seance.matiere || {};
    const horaire = seance.horaire || {};

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{matiere.nom || 'Matière inconnue'}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center text-gray-700">
                            <Calendar className="w-5 h-5 text-indigo-500 mr-3" />
                            <span className="font-medium">{seance.date}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Clock className="w-5 h-5 text-purple-500 mr-3" />
                            <span className="font-medium">{horaire.heure} - {horaire.hfin}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    <button
                        onClick={() => onAction(seance.id)}
                        className="w-full md:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/30"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Exprimer un vœu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoeuxPage;
