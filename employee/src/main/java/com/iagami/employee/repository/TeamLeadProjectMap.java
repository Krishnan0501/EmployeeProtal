package com.iagami.employee.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.iagami.employee.entity.Project;
import com.iagami.employee.entity.TeamLeadProjectMapping;

@Repository
public interface TeamLeadProjectMap extends JpaRepository<TeamLeadProjectMapping,Integer>{
	@Query(value = """
		    SELECT p.PROJECT_ID, p.PROJECT_CODE, p.CLIENT_NAME 
		    FROM employee_details ed 
		    JOIN reporting_manager rm ON ed.employee_id = rm.MANAGER_EMPLOYEE_ID 
		    JOIN teamlead_project_mapping tpm ON rm.MANAGER_ID = tpm.TeamLeadId 
		    JOIN project p ON tpm.ProjectId = p.project_id 
		    WHERE ed.employee_id = :employeeId
		    """, nativeQuery = true)
		List<Object[]> findRawProjectsByEmployeeId(@Param("employeeId") Integer employeeId);


}
