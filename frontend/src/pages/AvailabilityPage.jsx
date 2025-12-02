import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import AvailabilityService from '../services/availability.service';
import TeacherCalendar from '../components/TeacherCalendar';

const AvailabilityPage = () => {
    const [availabilities, setAvailabilities] = useState([]);
    const [user, setUser] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        loadAvailabilities(currentUser.id);
    }, [navigate]);

    const loadAvailabilities = async (userId) => {
        try {
            const data = await AvailabilityService.getMyAvailabilities(userId);
            setAvailabilities(data);
        } catch (error) {
            console.error("Failed to load availabilities", error);
        }
    };

    const handleAddAvailability = async (date, startTime, endTime) => {
        if (!user) return;
        try {
            await AvailabilityService.createAvailability(user.id, date, startTime, endTime);
            loadAvailabilities(user.id);
            setSuccess('Availability slot added successfully!');
            setError('');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data || 'Failed to add availability. It may conflict with an existing slot.');
            setSuccess('');
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this slot?')) {
            try {
                await AvailabilityService.deleteAvailability(id);
                loadAvailabilities(user.id);
                setSuccess('Slot deleted successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to delete availability');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                                <span className="text-xl">📅</span>
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                My Availability Calendar
                            </h1>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transform transition-all duration-300 hover:shadow-lg"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                        <p className="text-green-700 font-medium">✅ {success}</p>
                    </div>
                )}
                {error && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700 font-medium">❌ {error}</p>
                    </div>
                )}

                {/* Info Card */}
                <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
                    <p className="text-indigo-800">
                        <span className="font-bold">Click on any date</span> to add your available time slots.
                        Green dates show existing availability. Your assignments will be filtered based on these slots.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <div className="lg:col-span-2">
                        {user && (
                            <TeacherCalendar
                                userId={user.id}
                                availabilities={availabilities}
                                onAddAvailability={handleAddAvailability}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>

                    {/* Availability List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Your Time Slots ({availabilities.length})
                            </h2>

                            {availabilities.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="text-6xl">📅</span>
                                    <p className="mt-4 text-gray-500">
                                        No availability slots yet.
                                        <br />
                                        Click a date on the calendar to add one!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                    {availabilities
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .map((slot) => (
                                            <div
                                                key={slot.id}
                                                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200 hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-2">
                                                            <span className="text-xl mr-2">📅</span>
                                                            <h3 className="text-base font-bold text-gray-800">
                                                                {new Date(slot.date + 'T00:00').toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </h3>
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <span className="mr-2">🕐</span>
                                                            <span className="font-semibold">{slot.startTime} - {slot.endTime}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(slot.id)}
                                                        className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transform transition-all duration-300 hover:shadow-lg"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvailabilityPage;
