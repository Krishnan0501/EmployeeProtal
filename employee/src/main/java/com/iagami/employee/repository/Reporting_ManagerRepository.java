package com.iagami.employee.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.iagami.employee.entity.ReportingManager;

@Repository
public interface Reporting_ManagerRepository extends JpaRepository<ReportingManager,Integer> {
	@Query("SELECT rm FROM ReportingManager rm WHERE rm.reportingManagerEmpId = :managerEmployeeId")
	Optional<ReportingManager> findByManagerEmployeeId(@Param("managerEmployeeId") Integer managerEmployeeId);


}
