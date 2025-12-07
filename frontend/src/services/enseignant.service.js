import api from './api';

const getMyMatieres = async () => {
    const response = await api.get('/enseignants/me/matieres');
    return response.data;
};

export default {
    getMyMatieres
};
