import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExamService from '../services/exam.service';
import { FileText, Calendar } from '../components/icons';

const AdminExamsPage = () => {
    const [exams, setExams] = useState([]);
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        try {
            const data = await ExamService.getAllExams();
            setExams(data);
        } catch (error) {
            console.error("Failed to load exams", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await ExamService.createExam({ subject, date, startTime, endTime });
            loadExams();
            setSubject('');
            setDate('');
            setStartTime('');
            setEndTime('');
            setSuccess('Examen créé avec succès !');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            alert('Échec de la création de l\'examen');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) {
            try {
                await ExamService.deleteExam(id);
                loadExams();
            } catch (error) {
                alert('Échec de la suppression');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse-subtle"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none"></div>

            {/* Header */}
            <header className="relative z-50 bg-white/10 backdrop-blur-xl border-b border-white/10 sticky top-0 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 animate-slide-in-left">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-75"></div>
                                <div className="relative p-2 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 rounded-xl shadow-lg">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                                    Gestion des Examens
                                </h1>
                                <p className="text-xs text-blue-200 font-medium">
                                    Créez et gérez les sessions d'examens
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Card */}
                    <div className="lg:col-span-1 animate-fade-in">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-20"></div>
                            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                    Nouvel Examen
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-blue-200 text-sm font-semibold mb-2">
                                            Matière
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Ex: Génie Logiciel"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-blue-200 text-sm font-semibold mb-2">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all [color-scheme:dark]"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-blue-200 text-sm font-semibold mb-2">
                                                Début
                                            </label>
                                            <input
                                                type="time"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all [color-scheme:dark]"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-blue-200 text-sm font-semibold mb-2">
                                                Fin
                                            </label>
                                            <input
                                                type="time"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all [color-scheme:dark]"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {success && (
                                        <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl text-sm animate-fade-in">
                                            {success}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Création...' : 'Créer l\'examen'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="relative h-full">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-xl opacity-20"></div>
                            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col">
                                <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                        Liste des Examens
                                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30 ml-2">
                                            {exams.length}
                                        </span>
                                    </h2>
                                </div>

                                <div className="overflow-x-auto flex-1">
                                    <table className="min-w-full divide-y divide-white/10">
                                        <thead className="bg-white/5">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Matière</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Horaire</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-blue-200 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {exams.map((exam, index) => (
                                                <tr
                                                    key={exam.id}
                                                    className="hover:bg-white/5 transition-colors group"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">{exam.subject}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-blue-100/70">{exam.date}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                                            {exam.startTime} - {exam.endTime}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <button
                                                            onClick={() => handleDelete(exam.id)}
                                                            className="px-3 py-1.5 bg-red-500/10 text-red-300 border border-red-500/20 text-xs font-medium rounded-lg hover:bg-red-500/20 hover:text-red-200 transition-all hover:shadow-lg hover:shadow-red-500/10"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {exams.length === 0 && (
                                        <div className="text-center py-16">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FileText className="w-8 h-8 text-white/20" />
                                            </div>
                                            <p className="text-blue-200/50">Aucun examen créé pour le moment</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminExamsPage;
