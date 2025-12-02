import api from './api';

const getAllAssignments = async () => {
    try {
        const response = await api.get('/assignments');
        return response.data;
    } catch (error) {
        throw error;
    }
};

const generateAssignments = async (examId) => {
    try {
        await api.post(`/assignments/generate/${examId}`);
    } catch (error) {
        throw error;
    }
};

export default {
    getAllAssignments,
    generateAssignments
};
