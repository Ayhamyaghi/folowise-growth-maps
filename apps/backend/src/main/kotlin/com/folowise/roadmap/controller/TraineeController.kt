package com.folowise.roadmap.controller

import com.folowise.roadmap.dto.trainee.CreateTraineeRequest
import com.folowise.roadmap.dto.trainee.TraineeListItemResponse
import com.folowise.roadmap.service.TraineeService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/trainees")
class TraineeController(
    private val traineeService: TraineeService
) {

    @PostMapping
    fun createTrainee(@Valid @RequestBody request: CreateTraineeRequest): ResponseEntity<TraineeListItemResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(traineeService.createTrainee(request))

    @GetMapping
    fun listAll(): ResponseEntity<List<TraineeListItemResponse>> =
        ResponseEntity.ok(traineeService.listAll())

    @GetMapping("/{traineeId}")
    fun getById(@PathVariable traineeId: UUID): ResponseEntity<TraineeListItemResponse> =
        ResponseEntity.ok(traineeService.getById(traineeId))
}
