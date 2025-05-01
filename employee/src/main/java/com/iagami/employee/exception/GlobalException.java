package com.iagami.employee.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.iagami.employee.dto.ApiResponse;

@RestControllerAdvice
public class GlobalException {

    private static final Logger logger = LoggerFactory.getLogger(GlobalException.class);
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<?>> handleIllegalArgumentException(IllegalArgumentException ex) {
        logger.error("Illegal Argument Exception: {}", ex.getMessage());

        ApiResponse<Object> response = new ApiResponse<>();
        response.setResponseCode("400");
        response.setResponseMessage("Invalid Input: " + ex.getMessage());
        response.setData(null);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ApiResponse<?>> handleNullPointerException(NullPointerException ex) {
        logger.error("Null Pointer Exception: ", ex);

        ApiResponse<Object> response = new ApiResponse<>();
        response.setResponseCode("500");
        response.setResponseMessage("Unexpected error occurred");
        response.setData(null);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<?>> handleRuntimeException(RuntimeException ex) {
        logger.error("RuntimeException Occurred: {}", ex.getMessage());

        ApiResponse<Object> response = new ApiResponse<>();
        response.setResponseCode("500");
        response.setResponseMessage("A runtime error occurred: " + ex.getMessage());
        response.setData(null);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
