package com.iagami.employee.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.iagami.employee.entity.Project;

@Repository
public interface Project_Repository extends JpaRepository<Project,Integer> {
	@Query("SELECT p FROM Project p WHERE p.entityId = :companyid")
	List<Project> getProjectsofCompany(Integer companyid);

	

}
