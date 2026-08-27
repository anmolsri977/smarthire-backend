package com.smarthire.service;

import com.smarthire.dto.JobRequest;
import com.smarthire.model.Job;
import com.smarthire.model.User;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    // Naya job add karo
    public Job addJob(JobRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Job job = new Job();
        job.setCompanyName(request.getCompanyName());
        job.setRole(request.getRole());
        job.setStatus(request.getStatus());
        job.setAppliedDate(request.getAppliedDate());
        job.setNotes(request.getNotes());
        job.setUser(user);

        return jobRepository.save(job);
    }

    // User ke saare jobs lo
    public List<Job> getMyJobs(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return jobRepository.findByUserId(user.getId());
    }

    // Job update karo
    public Job updateJob(Long jobId, JobRequest request, String email) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found!"));

        // Check karo — ye job is user ki hai?
        if (!job.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized!");
        }

        job.setCompanyName(request.getCompanyName());
        job.setRole(request.getRole());
        job.setStatus(request.getStatus());
        job.setAppliedDate(request.getAppliedDate());
        job.setNotes(request.getNotes());

        return jobRepository.save(job);
    }

    // Job delete karo
    public void deleteJob(Long jobId, String email) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found!"));

        // Check karo — ye job is user ki hai?
        if (!job.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized!");
        }

        jobRepository.delete(job);
    }
}