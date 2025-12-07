import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VoeuService from '../services/voeu.service';
import SeanceService from '../services/seance.service';
import SurveillanceService from '../services/surveillance.service';
import EnseignantService from '../services/enseignant.service';
import AuthService from '../services/auth.service';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, PlusCircle, Printer } from '../components/icons';

const VoeuxPage = () => {
    const [myVoeux, setMyVoeux] = useState([]);
    const [seances, setSeances] = useState([]);
    const [myMatieres, setMyMatieres] = useState([]);
    const [capacity, setCapacity] = useState(null);
    const [activeTab, setActiveTab] = useState('my'); // 'my' or 'available'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const [saturationMap, setSaturationMap] = useState({});

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }
        setCurrentUser(user);
        loadData(user);
    }, [navigate]);

    const loadData = async (user) => {
        setLoading(true);
        setError('');
        try {
            // Load Wishes
            try {
                const voeuxData = await VoeuService.getMesVoeux();
                setMyVoeux(voeuxData);
            } catch (err) {
                console.error("Failed to load wishes", err);
                setError(prev => prev + "Failed to load wishes. " + (err.response?.data?.message || err.message) + "\n");
            }

            // Load Sessions
            try {
                const seancesData = await SeanceService.getAllSeances();
                setSeances(seancesData);
            } catch (err) {
                console.error("Failed to load sessions", err);
                setError(prev => prev + "Failed to load sessions. " + (err.response?.data?.message || err.message) + "\n");
            }

            // Load My Subjects (Matieres)
            try {
                const matieresData = await EnseignantService.getMyMatieres();
                setMyMatieres(matieresData);
            } catch (err) {
                console.error("Failed to load my subjects", err);
                // Non-blocking error
            }

            // Load Saturation Info
            try {
                const saturationData = await SurveillanceService.getResumeSeances();
                // Convert list to map for easier lookup: { seanceId: isSature }
                const map = {};
                saturationData.forEach(info => {
                    map[info.seanceId] = info.saturee;
                });
                setSaturationMap(map);
            } catch (err) {
                console.error("Failed to load saturation info", err);
            }

            // Load Capacity
            if (user && user.id) {
                try {
                    const capacityData = await SurveillanceService.getCapacity(user.id);
                    if (capacityData) {
                        setCapacity(capacityData.capaciteDisponible);
                    }
                } catch (err) {
                    console.error("Failed to load capacity", err);
                    // Don't show error for capacity as it's secondary
                }
            }
        } catch (err) {
            console.error("Unexpected error", err);
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleExprimerVoeu = async (seanceId) => {
        try {
            if (!currentUser || !currentUser.id) {
                setError("User information missing. Please login again.");
                return;
            }

            await VoeuService.exprimerVoeu(currentUser.id, seanceId, "Je suis intéressé");
            setSuccess('Vœu exprimé avec succès !');
            setTimeout(() => setSuccess(''), 3000);
            loadData(currentUser);
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
            loadData(currentUser);
        } catch (err) {
            setError(err.response?.data?.error || 'Échec lors de l\'annulation du vœu.');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Filter sessions that don't have a wish yet
    const availableSeances = seances.filter(seance =>
        !myVoeux.some(voeu => voeu.seance && voeu.seance.id === seance.id)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 print:bg-white">
            {/* Navbar - hidden on print */}
            <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50 print:hidden">
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
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handlePrint}
                                className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transform transition-all duration-300 hover:shadow-md"
                            >
                                <Printer className="w-5 h-5 mr-2" />
                                Imprimer
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transform transition-all duration-300 hover:shadow-lg"
                            >
                                ← Retour
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Print Header - visible only on print */}
                <div className="hidden print:block mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Fiche de Vœux de Surveillance</h1>
                    <p className="text-gray-600">Enseignant: {currentUser?.username}</p>
                    <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Capacity Info */}
                {capacity !== null && (
                    <div className="mb-6 bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 print:border-gray-300">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Ma Charge de Surveillance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-indigo-50 rounded-xl p-4 print:bg-gray-50">
                                <p className="text-sm text-indigo-600 font-medium mb-1">Capacité Requise</p>
                                <p className="text-2xl font-bold text-indigo-900">{capacity} séances</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-4 print:bg-gray-50">
                                <p className="text-sm text-purple-600 font-medium mb-1">Vœux Exprimés</p>
                                <p className="text-2xl font-bold text-purple-900">{myVoeux.length} séances</p>
                            </div>
                            <div className={`rounded-xl p-4 print:bg-gray-50 ${myVoeux.length >= capacity ? 'bg-green-50' : 'bg-yellow-50'}`}>
                                <p className={`text-sm font-medium mb-1 ${myVoeux.length >= capacity ? 'text-green-600' : 'text-yellow-600'}`}>Statut</p>
                                <p className={`text-2xl font-bold ${myVoeux.length >= capacity ? 'text-green-900' : 'text-yellow-900'}`}>
                                    {myVoeux.length >= capacity ? 'Objectif atteint ✅' : `Manque ${capacity - myVoeux.length} séances ⚠️`}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-fade-in print:hidden">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                            <p className="text-green-700 font-medium">{success}</p>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in print:hidden">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Tabs - hidden on print */}
                <div className="flex space-x-4 mb-6 print:hidden">
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
                        {/* Print View: Always show wishes */}
                        <div className="hidden print:block">
                            <h2 className="text-xl font-bold mb-4">Liste des Vœux</h2>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-2 text-left">Matière</th>
                                        <th className="border border-gray-300 p-2 text-left">Date</th>
                                        <th className="border border-gray-300 p-2 text-left">Horaire</th>
                                        <th className="border border-gray-300 p-2 text-left">Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myVoeux.map(voeu => (
                                        <tr key={voeu.id}>
                                            <td className="border border-gray-300 p-2">{voeu.seance?.matiere?.nom}</td>
                                            <td className="border border-gray-300 p-2">{voeu.seance?.date}</td>
                                            <td className="border border-gray-300 p-2">{voeu.seance?.horaire?.heure} - {voeu.seance?.horaire?.hfin}</td>
                                            <td className="border border-gray-300 p-2">{voeu.statut}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Interactive View */}
                        <div className="print:hidden">
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
                                            myMatieres={myMatieres}
                                            isSature={saturationMap[seance.id]}
                                        />
                                    ))
                                )
                            )}
                        </div>
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

const SeanceCard = ({ seance, onAction, myMatieres, isSature }) => {
    const matiere = seance.matiere || {};
    const horaire = seance.horaire || {};
    const enseigneMatiere = myMatieres.some(m => m.id === matiere.id);

    // Determine styling based on priority:
    // 1. Taught Subject (Orange)
    // 2. Saturated (Red)
    // 3. Available (Green)

    let borderColor = 'border-gray-100';
    let bgColor = 'bg-white';
    let headerColor = 'bg-gradient-to-r from-emerald-500 to-teal-500';
    let textColor = 'text-gray-800';
    let buttonColor = 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/30';
    let disabled = false;

    if (enseigneMatiere) {
        borderColor = 'border-orange-300';
        bgColor = 'bg-orange-50';
        headerColor = 'bg-orange-400';
        textColor = 'text-orange-800';
        buttonColor = 'bg-orange-200 text-orange-700 cursor-not-allowed border border-orange-300';
        disabled = true;
    } else if (isSature) {
        borderColor = 'border-red-300';
        bgColor = 'bg-red-50';
        headerColor = 'bg-red-500';
        textColor = 'text-red-800';
        buttonColor = 'bg-red-200 text-red-700 cursor-not-allowed border border-red-300';
        disabled = true;
    } else {
        // Green (Available) - Default but explicit for clarity
        borderColor = 'border-emerald-200';
        bgColor = 'bg-emerald-50';
        headerColor = 'bg-emerald-500';
        textColor = 'text-emerald-900';
        buttonColor = 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/30';
        disabled = false;
    }

    return (
        <div className={`rounded-2xl shadow-lg overflow-hidden border transition-all duration-300 transform hover:-translate-y-1 ${borderColor} ${bgColor} ${!disabled && 'hover:shadow-xl'}`}>
            <div className={`h-2 w-full ${headerColor}`}></div>
            <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-lg font-bold ${textColor}`}>{matiere.nom || 'Matière inconnue'}</h3>
                        {enseigneMatiere && (
                            <span className="px-2 py-0.5 rounded-full bg-orange-200 text-orange-800 text-xs font-bold">
                                Votre matière
                            </span>
                        )}
                        {!enseigneMatiere && isSature && (
                            <span className="px-2 py-0.5 rounded-full bg-red-200 text-red-800 text-xs font-bold">
                                Complet
                            </span>
                        )}
                        {!enseigneMatiere && !isSature && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold">
                                Disponible
                            </span>
                        )}
                    </div>

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
                        disabled={disabled}
                        className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${buttonColor}`}
                        title={enseigneMatiere ? "Vous ne pouvez pas surveiller votre propre matière" : (isSature ? "Cette séance est complète" : "")}
                    >
                        {enseigneMatiere ? (
                            <>
                                <XCircle className="w-5 h-5" />
                                Non autorisé
                            </>
                        ) : isSature ? (
                            <>
                                <XCircle className="w-5 h-5" />
                                Complet
                            </>
                        ) : (
                            <>
                                <PlusCircle className="w-5 h-5" />
                                Exprimer un vœu
                            </>
                        )}
                    </button>
                    {enseigneMatiere && (
                        <p className="text-xs text-orange-600 mt-2 text-center font-medium">
                            Conflit de matière
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoeuxPage;
