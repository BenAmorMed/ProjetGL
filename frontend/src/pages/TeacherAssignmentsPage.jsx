import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignmentService from '../services/assignment.service';
import AuthService from '../services/auth.service';
import { Calendar, Building, Clock, CheckCircle, XCircle, AlertCircle } from '../components/icons';

const TeacherAssignmentsPage = () => {
    const [myAssignments, setMyAssignments] = useState([]);
    const [availableAssignments, setAvailableAssignments] = useState([]);
    const [activeTab, setActiveTab] = useState('my'); // 'my' or 'available'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }
        loadData();
    }, [navigate]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [myData, availableData] = await Promise.all([
                AssignmentService.getMyAssignments(),
                AssignmentService.getAvailableAssignments()
            ]);
            setMyAssignments(myData);
            setAvailableAssignments(availableData);
        } catch (err) {
            console.error("Failed to load assignments", err);
            setError("Failed to load assignments data.");
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (id) => {
        try {
            await AssignmentService.claimAssignment(id);
            setSuccess('Assignment claimed successfully!');
            setTimeout(() => setSuccess(''), 3000);
            loadData();
        } catch (err) {
            setError(err.response?.data || 'Failed to claim assignment.');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleUnclaim = async (id) => {
        if (!window.confirm('Are you sure you want to release this assignment?')) return;

        try {
            await AssignmentService.unclaimAssignment(id);
            setSuccess('Assignment released successfully!');
            setTimeout(() => setSuccess(''), 3000);
            loadData();
        } catch (err) {
            setError(err.response?.data || 'Failed to release assignment.');
            setTimeout(() => setError(''), 3000);
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
                                <span className="text-xl">📋</span>
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                My Assignments
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
                        My Schedule ({myAssignments.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'available'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Available to Claim ({availableAssignments.length})
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {activeTab === 'my' ? (
                            myAssignments.length === 0 ? (
                                <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                                    <div className="text-6xl mb-4">📅</div>
                                    <h3 className="text-xl font-bold text-gray-700">No assignments yet</h3>
                                    <p className="text-gray-500 mt-2">Check the "Available to Claim" tab to find slots.</p>
                                </div>
                            ) : (
                                myAssignments.map((assignment) => (
                                    <AssignmentCard
                                        key={assignment.id}
                                        assignment={assignment}
                                        type="my"
                                        onAction={handleUnclaim}
                                    />
                                ))
                            )
                        ) : (
                            availableAssignments.length === 0 ? (
                                <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                                    <div className="text-6xl mb-4">✨</div>
                                    <h3 className="text-xl font-bold text-gray-700">No available assignments</h3>
                                    <p className="text-gray-500 mt-2">Check back later for new openings.</p>
                                </div>
                            ) : (
                                availableAssignments.map((assignment) => (
                                    <AssignmentCard
                                        key={assignment.id}
                                        assignment={assignment}
                                        type="available"
                                        onAction={handleClaim}
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

const AssignmentCard = ({ assignment, type, onAction }) => {
    const exam = assignment.exam || {};
    const room = assignment.room || {};

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className={`h-2 w-full ${type === 'my' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}></div>
            <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${type === 'my' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                            {exam.subject || 'Unknown Subject'}
                        </span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-500 text-sm font-medium">Exam ID: #{exam.id}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center text-gray-700">
                            <Calendar className="w-5 h-5 text-indigo-500 mr-3" />
                            <span className="font-medium">{exam.date}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Clock className="w-5 h-5 text-purple-500 mr-3" />
                            <span className="font-medium">{exam.startTime} - {exam.endTime}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Building className="w-5 h-5 text-pink-500 mr-3" />
                            <span className="font-medium">{room.name} (Capacity: {room.capacity})</span>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    <button
                        onClick={() => onAction(assignment.id)}
                        className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${type === 'my'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/30'
                            }`}
                    >
                        {type === 'my' ? (
                            <>
                                <XCircle className="w-5 h-5" />
                                Release
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Claim
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherAssignmentsPage;
