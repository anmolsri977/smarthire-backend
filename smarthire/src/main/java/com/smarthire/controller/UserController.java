package com.smarthire.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/profile")
    public ResponseEntity<String> getProfile(Principal principal) {
        return ResponseEntity.ok("Hello, " + principal.getName() + "! You are authenticated.");
    }
}