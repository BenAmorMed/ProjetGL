import React, { useState } from 'react';

const TeacherCalendar = ({ userId, availabilities = [], onAddAvailability, onDelete }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showTimeSelector, setShowTimeSelector] = useState(false);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const hasAvailabilityOnDate = (dateStr) => availabilities.some(av => av.date === dateStr);
    const getAvailabilitiesForDate = (dateStr) => availabilities.filter(av => av.date === dateStr);

    const handleDateClick = (day) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(clickedDate);
        setShowTimeSelector(true);
    };

    const handleAddTimeSlot = () => {
        if (!selectedDate) return;
        const dateStr = formatDate(selectedDate);
        onAddAvailability(dateStr, startTime, endTime);
        setShowTimeSelector(false);
        setStartTime('09:00');
        setEndTime('17:00');
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                    ← Previous
                </button>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {monthNames[month]} {year}
                </h2>
                <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                    Next →
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-gray-600 py-2">
                        {day}
                    </div>
                ))}

                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = formatDate(new Date(year, month, day));
                    const hasAvailability = hasAvailabilityOnDate(dateStr);
                    const availabilitiesOnDate = getAvailabilitiesForDate(dateStr);
                    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                    return (
                        <div
                            key={day}
                            onClick={() => handleDateClick(day)}
                            className={`aspect-square p-2 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${hasAvailability
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:from-green-100 hover:to-emerald-100'
                                    : 'bg-white hover:bg-indigo-50 border-gray-200'
                                } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
                        >
                            <div className="flex flex-col h-full">
                                <span className={`text-sm font-semibold ${hasAvailability ? 'text-green-700' : 'text-gray-700'}`}>
                                    {day}
                                </span>
                                {hasAvailability && (
                                    <div className="mt-1 space-y-1">
                                        {availabilitiesOnDate.map(av => (
                                            <div
                                                key={av.id}
                                                className="text-[10px] bg-green-600 text-white px-1 py-0.5 rounded truncate"
                                                title={`${av.startTime}-${av.endTime}`}
                                            >
                                                {av.startTime}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {showTimeSelector && selectedDate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">
                            Add Availability for {formatDate(selectedDate)}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    🕐 Start Time
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    🕐 End Time
                                </label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowTimeSelector(false)}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddTimeSlot}
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                                >
                                    Add Slot
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherCalendar;
