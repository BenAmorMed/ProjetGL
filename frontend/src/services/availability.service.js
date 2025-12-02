import api from './api';

const getMyAvailabilities = async (userId) => {
    try {
        const response = await api.get(`/availabilities/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getMonthAvailabilities = async (userId, year, month) => {
    try {
        const response = await api.get(`/availabilities/user/${userId}/month/${year}/${month}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getAvailabilitiesInRange = async (userId, startDate, endDate) => {
    try {
        const response = await api.get(`/availabilities/user/${userId}/range`, {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createAvailability = async (userId, date, startTime, endTime) => {
    try {
        const response = await api.post('/availabilities', {
            user: { id: userId },
            date,
            startTime,
            endTime
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createBulkAvailabilities = async (availabilities) => {
    try {
        const response = await api.post('/availabilities/bulk', availabilities);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteAvailability = async (id) => {
    try {
        await api.delete(`/availabilities/${id}`);
    } catch (error) {
        throw error;
    }
};

export default {
    getMyAvailabilities,
    getMonthAvailabilities,
    getAvailabilitiesInRange,
    createAvailability,
    createBulkAvailabilities,
    deleteAvailability
};
