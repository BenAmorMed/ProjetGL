import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomService from '../services/room.service';
import { Building, Users } from '../components/icons';

const AdminRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            const data = await RoomService.getAllRooms();
            setRooms(data);
        } catch (error) {
            console.error("Failed to load rooms", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await RoomService.createRoom({ name, capacity: parseInt(capacity), location });
            loadRooms();
            setName('');
            setCapacity('');
            setLocation('');
            setSuccess('Salle créée avec succès !');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            alert('Échec de la création de la salle');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
            try {
                await RoomService.deleteRoom(id);
                loadRooms();
            } catch (error) {
                alert('Échec de la suppression');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse-subtle"></div>
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
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-75"></div>
                                <div className="relative p-2 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-xl shadow-lg">
                                    <Building className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                                    Gestion des Salles
                                </h1>
                                <p className="text-xs text-purple-200 font-medium">
                                    Configurez les salles d'examen
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
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-20"></div>
                            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                    Nouvelle Salle
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-purple-200 text-sm font-semibold mb-2">
                                            Nom de la salle
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-200/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Ex: Salle A101"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-purple-200 text-sm font-semibold mb-2">
                                            Capacité
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-200/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Ex: 30"
                                            value={capacity}
                                            onChange={(e) => setCapacity(e.target.value)}
                                            required
                                            min="1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-purple-200 text-sm font-semibold mb-2">
                                            Emplacement
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-200/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Ex: Bâtiment A, Étage 1"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {success && (
                                        <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl text-sm animate-fade-in">
                                            {success}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] transition-all"
                                    >
                                        Créer la salle
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* List Card */}
                    <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="relative h-full">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl blur-xl opacity-20"></div>
                            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 h-full">
                                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Building className="w-5 h-5 text-purple-400" />
                                    Salles existantes
                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30 ml-2">
                                        {rooms.length}
                                    </span>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {rooms.map((room) => (
                                        <div
                                            key={room.id}
                                            className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{room.name}</h3>
                                                    <p className="text-sm text-purple-200/60 mt-1 flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                                                        {room.location}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(room.id)}
                                                    className="p-2 bg-red-500/10 text-red-300 rounded-lg hover:bg-red-500/20 hover:text-red-200 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex items-center mt-4 pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2 text-sm text-purple-200">
                                                    <Users className="w-4 h-4 text-purple-400" />
                                                    <span>Capacité: {room.capacity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {rooms.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Building className="w-8 h-8 text-white/20" />
                                        </div>
                                        <p className="text-purple-200/50">Aucune salle créée pour le moment</p>
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

export default AdminRoomsPage;
