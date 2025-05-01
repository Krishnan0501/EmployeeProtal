
package com.iagami.employee.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.iagami.employee.dto.ApiResponse;
import com.iagami.employee.dto.DashboardDto;
import com.iagami.employee.serviceInterface.Service_Interface;

@RestController
@RequestMapping("/api/employee")
public class DashBoardController {

    private static final Logger logger = LoggerFactory.getLogger(DashBoardController.class);

    @Autowired
    private Service_Interface service_Interface;

    @PostMapping("/totalWorkingHours")
    public ResponseEntity<?> getTotalWorkingHoursWithFallback(@RequestBody(required = false) Integer monthList) {
        try {
            logger.info("Fetching dashboard data for months: {}", monthList);
            DashboardDto data = service_Interface.dashboardgetdata(monthList);
             ApiResponse  responseVo= new ApiResponse();
             responseVo.setResponseCode("200");
             responseVo.setResponseMessage("Success");
             responseVo.setData(data);
            return ResponseEntity.ok(responseVo);
        } catch (Exception e) {
            logger.error("Error fetching dashboard data", e);
            ApiResponse  responseVo= new ApiResponse();
            responseVo.setResponseCode("500");
            responseVo.setResponseCode("Internal Server Error");
            responseVo.setData(null);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
