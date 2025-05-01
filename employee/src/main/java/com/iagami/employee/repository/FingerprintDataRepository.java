package com.iagami.employee.repository;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.iagami.employee.entity.FingerprintData;

public interface FingerprintDataRepository extends JpaRepository<FingerprintData,Integer>{
	@Query(value="select count(*) from fingerprintdata where date=:date and entity_Code=:entityName",nativeQuery = true)
	Integer findByDate(Date date,String entityName);

}
