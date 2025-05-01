package com.iagami.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.iagami.employee.entity.AuditTable;

public interface AuditTable_Repository extends JpaRepository<AuditTable,Integer> {

}
