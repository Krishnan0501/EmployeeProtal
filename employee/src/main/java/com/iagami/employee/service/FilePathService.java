package com.iagami.employee.service;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service
public class FilePathService {
	 @Value("${employee.excel.filepath}")
	    private String excelFilePath;

	    public Path getExcelFilePath() {
	        return Paths.get(excelFilePath);
	    }

}
