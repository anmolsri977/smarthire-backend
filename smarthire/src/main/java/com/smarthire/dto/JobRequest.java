package com.smarthire.dto;

import lombok.Data;

@Data
public class JobRequest {
    private String companyName;
    private String role;
    private String status;
    private String appliedDate;
    private String notes;
}