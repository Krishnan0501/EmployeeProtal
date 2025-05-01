package com.iagami.employee.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.iagami.employee.entity.EmployeeDetails;
import com.iagami.employee.repository.EmployeeDetails_Repository;
@ExtendWith(MockitoExtension.class)
class Service_ImplementationTest {
	@InjectMocks
	Service_Implementation serviceImplement;
	@Mock
	EmployeeDetails_Repository employeeDetails_Repository;
	@Test
	void getEmployeedataTest() {
		int employeeId=1;
		int roleId = 3;
        EmployeeDetails manager = new EmployeeDetails();
        manager.setEmployeeId(employeeId);
        manager.setRoleId(roleId);
        
        
        EmployeeDetails dummyEmployee = new EmployeeDetails();
        dummyEmployee.setEmployeeId(101);
        dummyEmployee.setEmployeeCode("EMP101");
        dummyEmployee.setEmployeeFirstName("Ravi");
        dummyEmployee.setEmployeeLastName("Kumar");
        dummyEmployee.setEmployeeEmail("ravi.kumar@example.com");
        dummyEmployee.setEmployeeType(1);
        dummyEmployee.setEmployeeDateOfBirth(java.sql.Date.valueOf("1990-01-15"));
        dummyEmployee.setEmployeeContactNumber(9876543210L);
        dummyEmployee.setEmployeeEmergencyNumber(9123456780L);
        dummyEmployee.setEmployeeDateOfJoin(java.sql.Date.valueOf("2020-05-10"));
        dummyEmployee.setEmployeeBloodGroup("B+");
        dummyEmployee.setCompany_id(10);
        dummyEmployee.setEmployeeReportingManager(1);  // Reporting Manager ID
        dummyEmployee.setDesignation_id(5);
        dummyEmployee.setEmployeeAddress(null);
        dummyEmployee.setDeleteFlag(0);
        dummyEmployee.setCreatedBy("admin");
        dummyEmployee.setModifyBy("admin");
        dummyEmployee.setRoleId(3);  // Marking as Manager

		//Mockito.when(employeeDetails_Repository.findById(employeeId)).thenReturn(dummyEmployee);
		//EmployeeDetails employeedetails=serviceImplement.getEmployeedata(1);
	}

}
