import api from './api';

const getAllSeances = async () => {
    try {
        const response = await api.get('/seances');
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createSeance = async (seance) => {
    try {
        const response = await api.post('/seances', seance);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteSeance = async (id) => {
    try {
        await api.delete(`/seances/${id}`);
    } catch (error) {
        throw error;
    }
};

export default {
    getAllSeances,
    createSeance,
    deleteSeance
};
