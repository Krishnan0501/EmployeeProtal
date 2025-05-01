package com.iagami.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.iagami.employee.entity.TaskStatus;

@Repository
public interface TaskStatus_Repository extends JpaRepository<TaskStatus,Integer>{

}
