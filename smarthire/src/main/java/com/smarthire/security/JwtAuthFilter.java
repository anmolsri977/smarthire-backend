package com.smarthire.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Request ke header se token nikalo
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        // 2. Check karo — header hai aur "Bearer " se start hota hai?
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // "Bearer " ke baad ka part = token
            email = jwtUtil.extractEmail(token); // token se email nikalo
        }

        // 3. Email mili aur abhi tak authenticated nahi?
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 4. Database se user load karo
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // 5. Token valid hai?
            if (jwtUtil.validateToken(token, userDetails.getUsername())) {

                // 6. User ko authenticated mark karo
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 7. Agle filter ko request pass karo
        filterChain.doFilter(request, response);
    }
}