package com.upec.gl.examsurveillance.service;

import com.upec.gl.examsurveillance.model.Availability;
import com.upec.gl.examsurveillance.model.User;
import com.upec.gl.examsurveillance.repository.AvailabilityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null") // Test code with explicit test scenarios
class AvailabilityServiceTest {

    @Mock
    private AvailabilityRepository availabilityRepository;

    @InjectMocks
    private AvailabilityService availabilityService;

    private User testUser;
    private Availability testAvailability;
    private LocalDate testDate;
    private LocalTime startTime;
    private LocalTime endTime;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testteacher");

        testDate = LocalDate.of(2025, 12, 15);
        startTime = LocalTime.of(9, 0);
        endTime = LocalTime.of(12, 0);

        testAvailability = new Availability();
        testAvailability.setId(1L);
        testAvailability.setUser(testUser);
        testAvailability.setDate(testDate);
        testAvailability.setStartTime(startTime);
        testAvailability.setEndTime(endTime);
    }

    @Test
    void getAvailabilityByUserId_ShouldReturnAvailabilities() {
        // Arrange
        List<Availability> expectedAvailabilities = Arrays.asList(testAvailability);
        when(availabilityRepository.findByUserId(1L)).thenReturn(expectedAvailabilities);

        // Act
        List<Availability> result = availabilityService.getAvailabilityByUserId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testAvailability, result.get(0));
        verify(availabilityRepository, times(1)).findByUserId(1L);
    }

    @Test
    void getAvailabilityByUserIdAndDateRange_ShouldReturnAvailabilitiesInRange() {
        // Arrange
        LocalDate startDate = LocalDate.of(2025, 12, 1);
        LocalDate endDate = LocalDate.of(2025, 12, 31);
        List<Availability> expectedAvailabilities = Arrays.asList(testAvailability);

        when(availabilityRepository.findByUserIdAndDateBetween(1L, startDate, endDate))
                .thenReturn(expectedAvailabilities);

        // Act
        List<Availability> result = availabilityService.getAvailabilityByUserIdAndDateRange(1L, startDate, endDate);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(availabilityRepository, times(1)).findByUserIdAndDateBetween(1L, startDate, endDate);
    }

    @Test
    void getMonthAvailability_ShouldReturnMonthData() {
        // Arrange
        LocalDate startOfMonth = LocalDate.of(2025, 12, 1);
        LocalDate endOfMonth = LocalDate.of(2025, 12, 31);
        List<Availability> expectedAvailabilities = Arrays.asList(testAvailability);

        when(availabilityRepository.findByUserIdAndDateBetween(1L, startOfMonth, endOfMonth))
                .thenReturn(expectedAvailabilities);

        // Act
        List<Availability> result = availabilityService.getMonthAvailability(1L, 2025, 12);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(availabilityRepository, times(1))
                .findByUserIdAndDateBetween(eq(1L), any(LocalDate.class), any(LocalDate.class));
    }

    @Test
    void createAvailability_NoConflict_ShouldSaveSuccessfully() {
        // Arrange
        when(availabilityRepository.findConflictingAvailabilities(
                eq(1L), eq(testDate), eq(startTime), eq(endTime)))
                .thenReturn(Collections.emptyList());
        when(availabilityRepository.save(testAvailability)).thenReturn(testAvailability);

        // Act
        Availability result = availabilityService.createAvailability(testAvailability);

        // Assert
        assertNotNull(result);
        assertEquals(testAvailability, result);
        verify(availabilityRepository, times(1)).findConflictingAvailabilities(
                eq(1L), eq(testDate), eq(startTime), eq(endTime));
        verify(availabilityRepository, times(1)).save(testAvailability);
    }

    @Test
    void createAvailability_WithConflict_ShouldThrowException() {
        // Arrange
        Availability conflictingAvailability = new Availability();
        conflictingAvailability.setId(2L);

        when(availabilityRepository.findConflictingAvailabilities(
                eq(1L), eq(testDate), eq(startTime), eq(endTime)))
                .thenReturn(Arrays.asList(conflictingAvailability));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            availabilityService.createAvailability(testAvailability);
        });

        assertTrue(exception.getMessage().contains("conflicts with existing time slot"));
        verify(availabilityRepository, times(1)).findConflictingAvailabilities(
                eq(1L), eq(testDate), eq(startTime), eq(endTime));
        verify(availabilityRepository, never()).save(any());
    }

    @Test
    void createBulkAvailability_NoConflicts_ShouldSaveAll() {
        // Arrange
        Availability availability2 = new Availability();
        availability2.setId(2L);
        availability2.setUser(testUser);
        availability2.setDate(LocalDate.of(2025, 12, 16));
        availability2.setStartTime(startTime);
        availability2.setEndTime(endTime);

        List<Availability> availabilities = Arrays.asList(testAvailability, availability2);

        when(availabilityRepository.findConflictingAvailabilities(any(), any(), any(), any()))
                .thenReturn(Collections.emptyList());
        when(availabilityRepository.save(any(Availability.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        List<Availability> result = availabilityService.createBulkAvailability(availabilities);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(availabilityRepository, times(2)).findConflictingAvailabilities(any(), any(), any(), any());
        verify(availabilityRepository, times(2)).save(any(Availability.class));
    }

    @Test
    void createBulkAvailability_WithConflict_ShouldThrowException() {
        // Arrange
        Availability availability2 = new Availability();
        availability2.setUser(testUser);
        availability2.setDate(testDate);
        availability2.setStartTime(startTime);
        availability2.setEndTime(endTime);

        List<Availability> availabilities = Arrays.asList(testAvailability, availability2);

        Availability conflictingAvailability = new Availability();
        conflictingAvailability.setId(99L);

        when(availabilityRepository.findConflictingAvailabilities(any(), any(), any(), any()))
                .thenReturn(Collections.emptyList())
                .thenReturn(Arrays.asList(conflictingAvailability));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            availabilityService.createBulkAvailability(availabilities);
        });

        assertTrue(exception.getMessage().contains("conflicts with existing time slot"));
        verify(availabilityRepository, times(2)).findConflictingAvailabilities(any(), any(), any(), any());
        verify(availabilityRepository, never()).save(any());
    }

    @Test
    void deleteAvailability_ShouldCallRepositoryDelete() {
        // Arrange
        Long availabilityId = 1L;

        // Act
        availabilityService.deleteAvailability(availabilityId);

        // Assert
        verify(availabilityRepository, times(1)).deleteById(availabilityId);
    }
}
