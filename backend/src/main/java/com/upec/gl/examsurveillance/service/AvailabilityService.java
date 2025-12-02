package com.upec.gl.examsurveillance.service;

import com.upec.gl.examsurveillance.model.Availability;
import com.upec.gl.examsurveillance.repository.AvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepository;

    @Autowired
    public AvailabilityService(AvailabilityRepository availabilityRepository) {
        this.availabilityRepository = availabilityRepository;
    }

    public List<Availability> getAvailabilityByUserId(Long userId) {
        return availabilityRepository.findByUserId(userId);
    }

    public List<Availability> getAvailabilityByUserIdAndDateRange(@NonNull Long userId, @NonNull LocalDate startDate,
            @NonNull LocalDate endDate) {
        return availabilityRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
    }

    public List<Availability> getMonthAvailability(@NonNull Long userId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        return getAvailabilityByUserIdAndDateRange(userId, java.util.Objects.requireNonNull(startDate),
                java.util.Objects.requireNonNull(endDate));
    }

    public Availability createAvailability(@NonNull Availability availability) {
        // Check for conflicts before creating
        List<Availability> conflicts = availabilityRepository.findConflictingAvailabilities(
                availability.getUser().getId(),
                availability.getDate(),
                availability.getStartTime(),
                availability.getEndTime());

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Availability conflicts with existing time slot on " + availability.getDate());
        }

        return availabilityRepository.save(availability);
    }

    @SuppressWarnings("null") // Repository save() is guaranteed to return non-null in JPA
    public List<Availability> createBulkAvailability(@NonNull List<Availability> availabilities) {
        List<Availability> saved = new ArrayList<>();

        // Validate each availability for conflicts
        for (Availability availability : availabilities) {
            List<Availability> conflicts = availabilityRepository.findConflictingAvailabilities(
                    availability.getUser().getId(),
                    availability.getDate(),
                    availability.getStartTime(),
                    availability.getEndTime());

            if (!conflicts.isEmpty()) {
                throw new RuntimeException(
                        "Availability conflicts with existing time slot on " + availability.getDate());
            }
        }

        // If no conflicts, save all
        for (Availability availability : availabilities) {
            saved.add(availabilityRepository.save(availability));
        }

        return saved;
    }

    public void deleteAvailability(@NonNull Long id) {
        availabilityRepository.deleteById(id);
    }
}
