package com.iagami.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.iagami.employee.entity.Company;
@Repository
public interface Company_Repository extends JpaRepository<Company,Integer>{

}
