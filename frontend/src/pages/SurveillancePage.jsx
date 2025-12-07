import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SurveillanceService from '../services/surveillance.service';
import SeanceService from '../services/seance.service';
import AuthService from '../services/auth.service';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from '../components/icons';

const SurveillancePage = () => {
    const [saturationData, setSaturationData] = useState([]);
    const [seances, setSeances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }
        loadData();
    }, [navigate]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [resumeData, seancesData] = await Promise.all([
                SurveillanceService.getResumeSeances(),
                SeanceService.getAllSeances()
            ]);
            console.log("Resume Data:", resumeData);
            console.log("Seances Data:", seancesData);
            setSaturationData(Array.isArray(resumeData) ? resumeData : []);
            setSeances(Array.isArray(seancesData) ? seancesData : []);
        } catch (err) {
            console.error("Failed to load surveillance data", err);
            setError("Failed to load surveillance data.");
        } finally {
            setLoading(false);
        }
    };

    const getSeanceDetails = (seanceId) => {
        if (!seances || !Array.isArray(seances)) return {};
        return seances.find(s => s.id === seanceId) || {};
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                                <span className="text-xl">📊</span>
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                État des Surveillances
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
                {error && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Séance</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Date & Heure</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">Requis</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">Actuels</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {saturationData.map((info) => {
                                        const seance = getSeanceDetails(info.seanceId);
                                        const matiere = seance.matiere || {};
                                        const horaire = seance.horaire || {};

                                        return (
                                            <tr key={info.seanceId} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-800">{matiere.nom || 'Unknown'}</div>
                                                    <div className="text-xs text-gray-500">ID: {info.seanceId}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center text-sm text-gray-600 mb-1">
                                                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                                            {seance.date}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="w-4 h-4 mr-2 text-purple-500" />
                                                            {horaire.heure} - {horaire.hfin}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                                                        {info.surveillantsRequis || info.survillantsRequis}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                                                        {info.voeuxExprimes}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {info.saturee ? (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                            <XCircle className="w-3 h-3 mr-1" />
                                                            Saturée
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Disponible ({info.placesRestantes} places)
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SurveillancePage;
