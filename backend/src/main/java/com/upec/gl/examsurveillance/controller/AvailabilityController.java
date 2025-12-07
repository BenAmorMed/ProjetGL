package com.upec.gl.examsurveillance.controller;

import com.upec.gl.examsurveillance.model.Availability;
import com.upec.gl.examsurveillance.service.AvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/availabilities")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Availability Management", description = "APIs for managing teacher availability schedules")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @Autowired
    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @Operation(summary = "Get teacher availabilities", description = "Retrieve all availability slots for a specific teacher")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved availabilities", content = @Content(schema = @Schema(implementation = Availability.class)))
    })
    @GetMapping("/user/{userId}")
    public List<Availability> getAvailabilityByUserId(
            @Parameter(description = "ID of the teacher") @PathVariable Long userId) {
        return availabilityService.getAvailabilityByUserId(userId);
    }

    @Operation(summary = "Get availability by date range", description = "Retrieve teacher availability slots within a specific date range")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved availability range")
    })
    @GetMapping("/user/{userId}/range")
    public List<Availability> getAvailabilityRange(
            @PathVariable @NonNull Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @NonNull LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @NonNull LocalDate endDate) {
        return availabilityService.getAvailabilityByUserIdAndDateRange(userId, startDate, endDate);
    }

    @Operation(summary = "Get monthly availability", description = "Retrieve teacher availability for a specific month and year")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved monthly availability")
    })
    @GetMapping("/user/{userId}/month/{year}/{month}")
    public List<Availability> getMonthAvailability(
            @PathVariable @NonNull Long userId,
            @PathVariable int year,
            @PathVariable int month) {
        return availabilityService.getMonthAvailability(userId, year, month);
    }

    @Operation(summary = "Create new availability", description = "Create a new teacher availability slot")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Availability created successfully"),
            @ApiResponse(responseCode = "400", description = "Conflict with existing availability")
    })
    @PostMapping
    public Availability createAvailability(
            @Parameter(description = "Availability details") @RequestBody @NonNull Availability availability) {
        return availabilityService.createAvailability(availability);
    }

    @Operation(summary = "Create bulk availabilities", description = "Create multiple teacher availability slots at once")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Bulk availabilities created successfully"),
            @ApiResponse(responseCode = "400", description = "Conflict with existing availability or invalid data")
    })
    @PostMapping("/bulk")
    public ResponseEntity<List<Availability>> createBulkAvailability(
            @RequestBody @NonNull List<Availability> availabilities) {
        try {
            List<Availability> created = availabilityService.createBulkAvailability(availabilities);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @Operation(summary = "Delete availability", description = "Delete a teacher availability slot by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Availability deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Availability not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable @NonNull Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.noContent().build();
    }
}
