package com.smarthire;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.smarthire")
@EnableJpaRepositories(basePackages = "com.smarthire.repository")
public class SmarthireApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmarthireApplication.class, args);
    }
}