package com.upec.gl.examsurveillance.repository;

import com.upec.gl.examsurveillance.model.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByUserId(Long userId);

    List<Availability> findByDate(LocalDate date);

    List<Availability> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT a FROM Availability a WHERE a.user.id = :userId AND a.date = :date " +
            "AND ((a.startTime < :endTime AND a.endTime > :startTime))")
    List<Availability> findConflictingAvailabilities(
            @Param("userId") Long userId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);
}
