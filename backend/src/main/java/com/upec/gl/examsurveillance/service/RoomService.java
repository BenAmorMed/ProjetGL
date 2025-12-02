package com.upec.gl.examsurveillance.service;

import com.upec.gl.examsurveillance.model.Room;
import com.upec.gl.examsurveillance.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    @Autowired
    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room createRoom(@NonNull Room room) {
        return roomRepository.save(room);
    }

    public void deleteRoom(@NonNull Long id) {
        roomRepository.deleteById(id);
    }
}
