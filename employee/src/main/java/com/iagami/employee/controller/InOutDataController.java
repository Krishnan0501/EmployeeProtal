package com.iagami.employee.controller;

import java.text.ParseException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.iagami.employee.dto.ApiResponse;
import com.iagami.employee.serviceInterface.Service_Interface;

@RestController
@RequestMapping("/api/employee")

public class InOutDataController {
	@Autowired
	private Service_Interface service_Interface;
	private static final Logger logger =LoggerFactory.getLogger(InOutDataController.class);
	@PostMapping("upload/inoutdata")
	public ResponseEntity<?> uploadExcelInOut(@RequestPart("file") MultipartFile excelfile) throws ParseException{
		logger.info("InOutDataController starting ");
		ApiResponse apiresponse =new ApiResponse();
		try {
			if(excelfile.isEmpty() || excelfile==null ||excelfile.getSize()==0) {
				apiresponse.setResponseCode("400");
				apiresponse.setResponseMessage("Uploaded file contain Nothing");
				apiresponse.setData(null);
				return ResponseEntity.badRequest().body(apiresponse);
			}
			String readinout=service_Interface.uploadExcelRead(excelfile);
			apiresponse.setResponseCode("200");
			apiresponse.setResponseMessage(readinout);
			apiresponse.setData(null);
			return ResponseEntity.ok().body(apiresponse);
		}catch(Exception e) {
			logger.error("Error while processing fingerprint  submissions", e);
			apiresponse.setResponseCode("500");
			apiresponse.setResponseMessage("Please Contact Admin...");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiresponse);
		}
		
	}

}
