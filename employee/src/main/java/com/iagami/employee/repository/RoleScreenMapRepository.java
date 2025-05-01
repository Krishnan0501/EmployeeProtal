package com.iagami.employee.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.iagami.employee.entity.RoleScreenMap;
@Repository
public interface RoleScreenMapRepository extends JpaRepository<RoleScreenMap,Integer> {
	@Query(value = "SELECT s.ID, s.TYPE FROM ROLE_SCREEN_MAPPING rsm " +
            "JOIN SCREEN s ON rsm.SCREEN_ID = s.ID " +
            "WHERE rsm.ROLE_ID = :roleId AND rsm.DELETE_FLAG = 0", nativeQuery = true)
List<Object[]> findScreensByRoleId(@Param("roleId") Integer roleId);
}
