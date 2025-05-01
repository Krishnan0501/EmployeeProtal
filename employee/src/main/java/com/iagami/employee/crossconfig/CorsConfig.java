package com.iagami.employee.crossconfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    // Solution 1: WebMvcConfigurer approach (your current implementation enhanced)
//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/")
//                        .allowedOrigins("http://localhost:5173")
//                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
//                        .allowedHeaders("*")
//                        .exposedHeaders("Authorization") // Important for frontend to access
//                        .allowCredentials(true)
//                        .maxAge(3600); // 1 hour
//            }
//        };
//    }

    // Solution 2: CorsFilter approach (works at a lower level)
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.addExposedHeader("Authorization");
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/", config);
        return new CorsFilter(source);
    }
}