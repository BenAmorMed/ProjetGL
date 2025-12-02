import api from './api';

const getAllExams = async () => {
    try {
        const response = await api.get('/exams');
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createExam = async (exam) => {
    try {
        const response = await api.post('/exams', exam);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteExam = async (id) => {
    try {
        await api.delete(`/exams/${id}`);
    } catch (error) {
        throw error;
    }
};

export default {
    getAllExams,
    createExam,
    deleteExam
};
