package com.smarthire.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String role;
    private String status; // APPLIED, INTERVIEW, REJECTED, OFFER
    private String appliedDate;
    private String notes;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}