import api from './api';

const getMesVoeux = async () => {
    const response = await api.get('/voeux/mes-voeux');
    return response.data;
};

const exprimerVoeu = async (enseignantId, seanceId, commentaire) => {
    const response = await api.post('/voeux', { enseignantId, seanceId, commentaire });
    return response.data;
};

const annulerVoeu = async (voeuId, enseignantId) => {
    const response = await api.delete(`/voeux/${voeuId}`, { params: { enseignantId } });
    return response.data;
};

const getVoeuStats = async (enseignantId) => {
    const response = await api.get(`/voeux/stats/${enseignantId}`);
    return response.data;
};

export default {
    getMesVoeux,
    exprimerVoeu,
    annulerVoeu,
    getVoeuStats
};
