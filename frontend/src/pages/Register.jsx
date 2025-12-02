import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'TEACHER'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setIsLoading(true);
        try {
            await AuthService.register(
                formData.username,
                formData.email,
                formData.password,
                formData.role
            );
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Échec de l\'inscription');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F8FBFF] to-[#E9F1FF] flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xl text-white">🎓</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">ExamSupervisor</h1>
                            <p className="text-sm text-gray-600">Gestion des surveillances d'examens</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-card-lg shadow-professional-lg p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Créer un compte
                            </h2>
                            <p className="text-sm text-gray-600">
                                Rejoignez ExamSupervisor
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                    <p className="text-green-700 text-sm">Compte créé avec succès ! Redirection...</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom d'utilisateur
                                </label>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-professional"
                                    placeholder="Choisissez un nom d'utilisateur"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-professional"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mot de passe
                                    </label>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-professional"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmer
                                    </label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-professional"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Je suis...
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'TEACHER' })}
                                        className={`py-3 px-4 rounded-lg font-medium transition-professional ${formData.role === 'TEACHER'
                                                ? 'bg-primary text-white shadow-professional'
                                                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary'
                                            }`}
                                    >
                                        Enseignant
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                                        className={`py-3 px-4 rounded-lg font-medium transition-professional ${formData.role === 'ADMIN'
                                                ? 'bg-primary text-white shadow-professional'
                                                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary'
                                            }`}
                                    >
                                        Administrateur
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || success}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-professional shadow-professional"
                            >
                                {isLoading ? 'Création du compte...' : 'Créer le compte'}
                            </button>

                            <div className="text-center text-sm">
                                <span className="text-gray-600">Vous avez déjà un compte ? </span>
                                <Link to="/login" className="font-semibold text-primary hover:text-primary-700 transition-professional">
                                    Se connecter
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
