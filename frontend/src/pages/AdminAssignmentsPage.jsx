import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignmentService from '../services/assignment.service';
import ExamService from '../services/exam.service';
import { Users, Building, Calendar, ClipboardCheck } from '../components/icons';

const AdminAssignmentsPage = () => {
    const [assignments, setAssignments] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [success, setSuccess] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const assignmentsData = await AssignmentService.getAllAssignments();
            setAssignments(assignmentsData);
            const examsData = await ExamService.getAllExams();
            setExams(examsData);
        } catch (error) {
            console.error("Failed to load data", error);
        }
    };

    const handleGenerate = async () => {
        if (!selectedExamId) {
            alert('Veuillez sélectionner un examen');
            return;
        }
        setIsGenerating(true);
        try {
            await AssignmentService.generateAssignments(selectedExamId);
            setSuccess('Affectations générées avec succès !');
            setTimeout(() => setSuccess(''), 3000);
            loadData();
        } catch (error) {
            alert('Échec de la génération. Vérifiez les salles et les enseignants disponibles.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse-subtle"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none"></div>

            {/* Header */}
            <header className="relative z-50 bg-white/10 backdrop-blur-xl border-b border-white/10 sticky top-0 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 animate-slide-in-left">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur-lg opacity-75"></div>
                                <div className="relative p-2 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-xl shadow-lg">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl font-black bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    Gestion des Affectations
                                </h1>
                                <p className="text-xs text-indigo-200 font-medium">
                                    Générez les plannings intelligemment
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg transition-all hover:shadow-lg backdrop-blur-md"
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto p-6">
                {/* Generate Section */}
                <div className="mb-8 animate-fade-in">
                    <div className="relative overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-90"></div>
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                        <div className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <ClipboardCheck className="w-6 h-6 text-white" />
                                    </div>
                                    Générateur Automatique
                                </h2>
                                <p className="text-indigo-100/80">
                                    Sélectionnez un examen et laissez l'IA assigner automatiquement les enseignants aux salles disponibles.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <select
                                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all min-w-[250px] [&>option]:text-gray-900"
                                    value={selectedExamId}
                                    onChange={(e) => setSelectedExamId(e.target.value)}
                                >
                                    <option value="">Sélectionner un examen...</option>
                                    {exams.map(exam => (
                                        <option key={exam.id} value={exam.id}>
                                            {exam.subject} ({exam.date} {exam.startTime})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleGenerate}
                                    disabled={!selectedExamId || isGenerating}
                                    className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {isGenerating ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Génération...
                                        </>
                                    ) : (
                                        <>
                                            Générer
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        {success && (
                            <div className="absolute bottom-0 left-0 right-0 bg-green-500/90 backdrop-blur-md text-white px-6 py-2 text-center text-sm font-medium animate-slide-up">
                                ✅ {success}
                            </div>
                        )}
                    </div>
                </div>

                {/* Assignments Table */}
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-blue-600/10 rounded-2xl blur-xl opacity-20"></div>
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5 text-indigo-400" />
                                    Affectations
                                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/30 ml-2">
                                        {assignments.length}
                                    </span>
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-white/10">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-200 uppercase tracking-wider">Examen</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-200 uppercase tracking-wider">Salle</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-indigo-200 uppercase tracking-wider">Surveillant</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {assignments.map((assignment) => (
                                            <tr key={assignment.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                                            {assignment.exam ? assignment.exam.subject : 'Inconnu'}
                                                        </div>
                                                        <div className="text-xs text-indigo-200/60 flex items-center gap-1 mt-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {assignment.exam ? `${assignment.exam.date} ${assignment.exam.startTime}-${assignment.exam.endTime}` : ''}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                                        <Building className="w-3 h-3" />
                                                        {assignment.room ? assignment.room.name : 'Inconnu'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                                        <Users className="w-3 h-3" />
                                                        {assignment.supervisor ? assignment.supervisor.username : 'Inconnu'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {assignments.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ClipboardCheck className="w-8 h-8 text-white/20" />
                                        </div>
                                        <p className="text-indigo-200/50">Aucune affectation générée pour le moment</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAssignmentsPage;
