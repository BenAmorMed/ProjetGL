import api from './api';

const getAllRooms = async () => {
    try {
        const response = await api.get('/rooms');
        return response.data;
    } catch (error) {
        throw error;
    }
};

const createRoom = async (room) => {
    try {
        const response = await api.post('/rooms', room);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteRoom = async (id) => {
    try {
        await api.delete(`/rooms/${id}`);
    } catch (error) {
        throw error;
    }
};

export default {
    getAllRooms,
    createRoom,
    deleteRoom
};
