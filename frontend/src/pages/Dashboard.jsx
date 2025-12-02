import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { GraduationCap, Calendar, Users, ClipboardCheck, Building, FileText, LogOut } from '../components/icons';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
        }
    }, [navigate]);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    if (!user) return null;

    const features = user.role === 'TEACHER' ? [
        {
            icon: <Calendar className="w-6 h-6 text-white" />,
            title: 'Mes disponibilités',
            description: 'Gérez vos créneaux horaires disponibles',
            action: () => navigate('/availability'),
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: <ClipboardCheck className="w-6 h-6 text-white" />,
            title: 'Mes affectations',
            description: 'Consultez vos surveillances programmées',
            action: () => { },
            color: 'from-purple-500 to-pink-500'
        }
    ] : [
        {
            icon: <FileText className="w-6 h-6 text-white" />,
            title: 'Gestion des examens',
            description: 'Créez et gérez les sessions d\'examens',
            action: () => navigate('/admin/exams'),
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: <Building className="w-6 h-6 text-white" />,
            title: 'Gestion des salles',
            description: 'Configurez les salles d\'examen',
            action: () => navigate('/admin/rooms'),
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: <Users className="w-6 h-6 text-white" />,
            title: 'Affectations automatiques',
            description: 'Générez les plannings intelligemment',
            action: () => navigate('/admin/assignments'),
            color: 'from-indigo-500 to-blue-500'
        }
    ];

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
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-75"></div>
                                <div className="relative p-2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    ExamSupervisor
                                </h1>
                                <p className="text-xs text-blue-200 font-medium">
                                    Espace {user.role === 'ADMIN' ? 'Administrateur' : 'Enseignant'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 animate-slide-in-right">
                            <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-blue-100">{user.username}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="group flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg border border-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/10"
                            >
                                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-sm font-medium">Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto py-12 px-6">
                <div className="mb-12 animate-fade-in">
                    <h2 className="text-4xl font-black text-white mb-4">
                        Bienvenue, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user.username}</span>
                    </h2>
                    <p className="text-blue-200 text-lg">Gérez vos activités depuis votre tableau de bord personnel</p>
                </div>

                <div className="flex flex-row flex-wrap gap-6 justify-center items-stretch">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            onClick={feature.action}
                            className="group relative animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                            <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>

                                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-blue-200/70 text-xs leading-relaxed mb-4">
                                    {feature.description}
                                </p>

                                <div className="flex items-center text-white/50 text-sm font-medium group-hover:text-white transition-colors">
                                    <span>Accéder</span>
                                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
