package com.smarthire.controller;

import com.smarthire.dto.JobRequest;
import com.smarthire.model.Job;
import com.smarthire.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    // Job add karo
    @PostMapping
    public ResponseEntity<Job> addJob(@RequestBody JobRequest request,
                                      Principal principal) {
        return ResponseEntity.ok(jobService.addJob(request, principal.getName()));
    }

    // Apne saare jobs dekho
    @GetMapping
    public ResponseEntity<List<Job>> getMyJobs(Principal principal) {
        return ResponseEntity.ok(jobService.getMyJobs(principal.getName()));
    }

    // Job update karo
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id,
                                         @RequestBody JobRequest request,
                                         Principal principal) {
        return ResponseEntity.ok(jobService.updateJob(id, request, principal.getName()));
    }

    // Job delete karo
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id,
                                             Principal principal) {
        jobService.deleteJob(id, principal.getName());
        return ResponseEntity.ok("Job deleted successfully!");
    }
}