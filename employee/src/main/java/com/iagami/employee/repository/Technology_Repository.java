package com.iagami.employee.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.iagami.employee.entity.Technology;
@Repository
public interface Technology_Repository extends JpaRepository<Technology,Integer>{
	@Query("SELECT t FROM Technology t WHERE t.projectId = :project_id")
	List<Technology> getProjectstechnology(Integer project_id);


}
