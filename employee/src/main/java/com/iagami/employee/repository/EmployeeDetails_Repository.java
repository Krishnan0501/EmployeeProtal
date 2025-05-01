package com.iagami.employee.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.iagami.employee.entity.EmployeeDetails;
@Repository
public interface EmployeeDetails_Repository extends JpaRepository<EmployeeDetails,Integer>{

	@Query("Select u from EmployeeDetails u where u.employeeEmail =:employeeEmail and u.deleteFlag = 0")
	Optional<EmployeeDetails> findemailId(@Param("employeeEmail") String employeeEmail);
	@Query("SELECT e FROM EmployeeDetails e WHERE e.employeeCode = :employeeCode")
    EmployeeDetails findByEmployeeCode(@Param("employeeCode") String employeeCode);
	@Query("SELECT e FROM EmployeeDetails e WHERE e.employeeEmail = :employeeCode")
    EmployeeDetails findByEmployeeMail(@Param("employeeCode") String employeeCode);
	@Query("""
		    SELECT 
		   e
		    FROM EmployeeDetails e 
		    JOIN ReportingManager rm ON e.employeeReportingManager = rm.reportingManagerId
		    WHERE rm.reportingManagerEmpId = :userId
		    """)
		List<EmployeeDetails> getTeamMembers(@Param("userId") Integer userId);
	
		@Query("""
			    SELECT 
			    e.employeeId
			    FROM EmployeeDetails e 
			    JOIN ReportingManager rm ON e.employeeReportingManager = rm.reportingManagerId
			    WHERE rm.reportingManagerEmpId = :userId
			    """)
			List<String> getTeamMembersExcel(@Param("userId") Integer userId);
		
		
	@Query("""
		    SELECT e
		    FROM EmployeeDetails e 
		    LEFT JOIN ReportingManager rm ON e.employeeReportingManager = rm.reportingManagerId
		    LEFT JOIN EmployeeDetails m ON rm.reportingManagerEmpId = m.employeeId
		    """)
		List<EmployeeDetails> fetchEmployeeData();
	@Query(value = """
		    SELECT rm.MANAGER_NAME
		    FROM employee_details e
		    JOIN reporting_manager rm ON e.EMPLOYEE_REPORTING_MANAGER = rm.MANAGER_ID
		    WHERE e.EMPLOYEE_ID = :userId
		    """, nativeQuery = true)
		String findManagerNameByEmployeeId(@Param("userId") Integer userId);
	
	@Query("SELECT e FROM EmployeeDetails e WHERE e.employeeId = :employeeCode")
   Optional<EmployeeDetails> findById(@Param("employeeCode") Integer employeeCode);
	
	@Query("SELECT e.roleId FROM EmployeeDetails e WHERE e.employeeEmail = :email")
	Integer findRoleIdByEmail(@Param("email") String email);
	
	@Query("SELECT e.roleId,e.company_id,c.entityCode, e.employeeId,ud.password, ud.firstLogin FROM EmployeeDetails e " +
		       "LEFT JOIN UserDetailsEntity ud ON e.employeeEmail = ud.emailId " +
			"LEFT JOIN Company c ON e.company_id=c.entityId "+
		       "WHERE e.employeeEmail = :email")
	List<Object[]> userInfoByEmail(@Param("email") String email);
	
	


}