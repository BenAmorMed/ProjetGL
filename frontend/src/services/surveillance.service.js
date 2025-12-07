import api from './api';

const getResumeSeances = async () => {
    const response = await api.get('/surveillance/resume-seances');
    return response.data;
};

const getSaturationInfo = async (seanceId) => {
    const response = await api.get(`/surveillance/saturation-info/${seanceId}`);
    return response.data;
};

const getCapacity = async (enseignantId) => {
    const response = await api.get(`/surveillance/capacity/${enseignantId}`);
    return response.data;
};

export default {
    getResumeSeances,
    getSaturationInfo,
    getCapacity
};
