import api from './api';

const getAllAssignments = async () => {
    try {
        const response = await api.get('/assignments');
        return response.data;
    } catch (error) {
        throw error;
    }
};

const generateAssignments = async (seanceId) => {
    try {
        await api.post(`/assignments/generate/${seanceId}`);
    } catch (error) {
        throw error;
    }
};

export default {
    getAllAssignments,
    generateAssignments,
    getMyAssignments: async () => {
        try {
            const response = await api.get('/assignments/my-assignments');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getAvailableAssignments: async () => {
        try {
            const response = await api.get('/assignments/available');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    claimAssignment: async (id) => {
        try {
            const response = await api.post(`/assignments/${id}/claim`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    unclaimAssignment: async (id) => {
        try {
            await api.delete(`/assignments/${id}/claim`);
        } catch (error) {
            throw error;
        }
    }
};
