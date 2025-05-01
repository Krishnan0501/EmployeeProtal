package com.iagami.employee.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.iagami.employee.entity.Status;
@Repository
public interface Status_Repository extends JpaRepository<Status,Integer> {
	
	@Query("Select s from Status s where s.statusCode=:statusCode and s.deleteFlag=0 ")
	public Status retrieveStatusDetails(@Param("statusCode")String statusCode);
	@Query("Select s from Status s where  s.deleteFlag=0 ")
	public List<Status> getStatuscode();
	@Query("Select s from Status s where  s.statusCode=:statusCode")
	public Status findCode(String statusCode);

}
