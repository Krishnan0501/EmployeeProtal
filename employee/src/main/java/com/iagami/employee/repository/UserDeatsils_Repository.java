package com.iagami.employee.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.iagami.employee.dto.*;
import com.iagami.employee.entity.*;

import jakarta.transaction.Transactional;
@Repository
public interface UserDeatsils_Repository extends JpaRepository<UserDetailsEntity,Integer>{
	@Query("Select u from UserDetailsEntity u where u.userId =:userId and u.deleteFlag = false")
	Optional<UserDetailsEntity> finduserId(@Param("userId") Long userId);


	@Query("Select u from UserDetailsEntity u where u.emailId=:emailId and u.deleteFlag = false")
	Optional<UserDetailsEntity> findemailid(@Param("emailId") String emailId);

	@Query("SELECT u FROM UserDetailsEntity u WHERE u.deleteFlag = false")
	List<UserDetailsEntity> findAllActiveUsers();

	@Modifying
	@Transactional
	@Query("UPDATE UserDetailsEntity u SET u.deleteFlag = true, u.activeFlag = false WHERE u.userId = :userId")
	void softDeleteUser(@Param("userId") Long userId);

	@Query("SELECT new com.iagami.employee.dto.EmployeeUserDetailsDto(e, u, d) " +
			"FROM UserDetailsEntity u " +
			"JOIN u.employee e " +  // Use entity reference instead of ON condition
			"JOIN Designation d ON d.designationId = e.designation_id " +  
			"WHERE u.emailId = :emailId")
	Optional<EmployeeUserDetailsDto> logindata(@Param("emailId") String emailId);

	@Query("Select u.password from UserDetailsEntity u  WHERE u.emailId = :emailId")
	String getpassword(String emailId);

	@Query("SELECT u FROM UserDetailsEntity u WHERE u.employee.employeeCode = :employeeCode")
	Optional<UserDetailsEntity> findByEmployeeCode(@Param("employeeCode") String employeeCode);

	@Modifying
	@Transactional
	@Query("UPDATE UserDetailsEntity u SET u.password = :newPassword, u.firstLogin = false WHERE u.emailId = :emailId")
	void updatePasswordByEmail(@Param("emailId") String emailId, @Param("newPassword") String newPassword);

}