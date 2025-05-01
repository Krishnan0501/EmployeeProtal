package com.iagami.employee.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.iagami.employee.entity.Domain;

@Repository
public interface DomainRepository extends JpaRepository<Domain,Integer>{
	@Query("Select d.domainName from Domain d")
	 List<String> getDomain() ;

}
