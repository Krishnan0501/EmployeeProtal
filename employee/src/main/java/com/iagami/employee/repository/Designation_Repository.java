package com.iagami.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.iagami.employee.entity.Designation;
@Repository
public interface Designation_Repository extends JpaRepository<Designation, Integer>{

}
