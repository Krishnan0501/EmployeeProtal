package com.iagami.employee.service;

import java.util.Base64;
import java.util.Collections;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.iagami.employee.entity.Role;
import com.iagami.employee.entity.UserDetailsEntity;
import com.iagami.employee.repository.RoleRepository;
import com.iagami.employee.repository.UserDeatsils_Repository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private UserDeatsils_Repository userDetailsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private RoleRepository roleRepository;
    

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.info("Attempting to load user by email: {}", email);

        UserDetailsEntity user = userDetailsRepository.findemailid(email)
                .orElseThrow(() -> {
                    logger.warn("User not found with email: {}", email);
                    return new UsernameNotFoundException("User Not Found with email: " + email);
                });
       
       int employeeId= user.getEmployee().getRoleId();
      
       Optional<Role> u=roleRepository.findById(employeeId);
      
        String password = user.getPassword();

        // 🔄 MIGRATION CHECK: If not already a BCrypt hash, convert it
        if (!password.startsWith("$2a$")) { // BCrypt hashes start with $2a$, $2b$, or $2y$
            try {
                String decoded = new String(Base64.getDecoder().decode(password));
                String bcryptPassword = passwordEncoder.encode(decoded);

                //user.setPassword(bcryptPassword);
              //  userDetailsRepository.save(user); // ✅ Update in DB
                logger.info("Migrated password to BCrypt for user: {}", email);

                password = bcryptPassword; // Use updated password
            } catch (IllegalArgumentException e) {
                logger.error("Failed to decode Base64 password for user: {}", email);
                throw new UsernameNotFoundException("Password format invalid for user: " + email);
            }
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmailId(),
                password,
                Collections.singletonList(new SimpleGrantedAuthority(u.get().getType()))
        );
    }
}