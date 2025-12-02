import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Calendar, Users, ClipboardCheck, ArrowRight, Check, Clock, Zap, BarChart2 } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, className = '' }) => (
    <div className={`group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 ${className}`}>
        <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
            <Icon className="w-6 h-6 text-primary-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
    </div>
);

const StatCard = ({ value, label, icon: Icon, className = '' }) => (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary-500/10">
                <Icon className="w-6 h-6 text-primary-400" />
            </div>
            <div>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
            </div>
        </div>
    </div>
);

const BenefitItem = ({ children }) => (
    <li className="flex items-start space-x-3">
        <Check className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
        <span className="text-gray-300">{children}</span>
    </li>
);

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Calendar,
            title: 'Gestion des Examens',
            description: 'Planifiez et gérez facilement tous vos examens en un seul endroit.',
        },
        {
            icon: Users,
            title: 'Surveillants',
            description: 'Attribuez et gérez les surveillants pour chaque session d\'examen.',
        },
        {
            icon: ClipboardCheck,
            title: 'Suivi en Temps Réel',
            description: 'Visualisez les disponibilités et les affectations en temps réel.',
        },
        {
            icon: BarChart2,
            title: 'Analytics Avancé',
            description: 'Rapports personnalisables et statistiques détaillées en temps réel.',
        },
    ];

    const stats = [
        { value: '95%', label: 'Taux de satisfaction', icon: BarChart2 },
        { value: '10x', label: 'Plus rapide', icon: Zap },
        { value: '24/7', label: 'Support disponible', icon: Clock },
    ];

    const benefits = [
        'Gestion simplifiée des plannings',
        'Réduction des conflits d\'emploi du temps',
        'Notifications automatiques',
        'Rapports détaillés',
        'Interface intuitive',
        'Sécurité des données'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-secondary-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />

            {/* Header */}
            <header className="relative z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                                    ExamSupervisor
                                </h1>
                                <p className="text-xs text-gray-400">Gestion Intelligente des Examens</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all duration-200 flex items-center space-x-2 group hover:shadow-lg hover:shadow-primary-500/20"
                            >
                                <span>Se connecter</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10">
                {/* Hero Section */}
                <section className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-primary-500/10 text-primary-400 mb-6 border border-primary-500/20">
                                <span className="relative flex h-2 w-2 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                </span>
                                Solution Premium
                            </div>

                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                                Automatisez la gestion
                                <br />
                                <span className="bg-gradient-to-r from-primary-400 via-cyan-400 to-primary-400 bg-clip-text text-transparent bg-300% animate-gradient">
                                    des surveillances d'examens
                                </span>
                            </h2>

                            <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Une plateforme intelligente pour optimiser la gestion des vœux enseignants et l'affectation automatique, sans effort.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-lg rounded-xl shadow-xl shadow-primary-500/20 hover:shadow-2xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    Commencer maintenant
                                </button>
                                <button className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all duration-200">
                                    Voir la documentation
                                </button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                {stats.map((stat, index) => (
                                    <StatCard key={index} {...stat} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl font-bold text-white mb-4">
                                Fonctionnalités <span className="text-primary-400">Premium</span>
                            </h3>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Des outils puissants conçus pour simplifier chaque aspect de la gestion des examens.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 relative">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative rounded-3xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600"></div>
                            <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:20px_20px]" />

                            <div className="relative p-12 text-center">
                                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                                    Prêt à révolutionner votre gestion ?
                                </h3>
                                <p className="text-primary-100 mb-8 max-w-xl mx-auto text-lg">
                                    Rejoignez les établissements qui font confiance à ExamSupervisor pour leur organisation.
                                </p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-8 py-4 bg-white text-primary-600 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-200"
                                >
                                    Créer un compte gratuitement
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">
                                ExamSupervisor
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">
                            © 2024 ExamSupervisor. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
