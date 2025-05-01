package com.iagami.employee.entity;

import java.sql.Timestamp;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "EMPLOYEE_DETAILS")
public class EmployeeDetails {
	    @Id
	    private Integer employeeId;

	    @Column(unique = true, nullable = false, length = 50)

	    private String employeeCode;
	    @Column(name = "EMPLOYEE_FIRSTNAME",nullable = false, length = 100)
	    private String employeeFirstName;

	    @Column(name = "EMPLOYEE_LASTNAME",nullable = false, length = 100)
	    private String employeeLastName;

	    @Column(unique = true, nullable = false, length = 50)
	    private String employeeEmail;

	    @Column(nullable = false)
	    private Integer employeeType;

	    @Column(nullable = false)
	    private Date employeeDateOfBirth;

	    @Column(nullable = false)
	    private Long employeeContactNumber;

	    @Column(nullable = false)
	    private Long employeeEmergencyNumber;

	    @Column(nullable = false)
	    private Date employeeDateOfJoin;

	    private String employeeBloodGroup;

	    
	    @Column(name = "employee_company_id", nullable = false)
	    private Integer company_id;

	    @Column(nullable = false, length = 100)
	    private Integer employeeReportingManager;

	   
	    @Column(name = "employee_role_id", nullable = false)
	    private Integer designation_id;

	    private Integer employeeAddress;

	    @Column(nullable = false)
	    private int deleteFlag = 0;

	    private String createdBy;

	    @CreationTimestamp
	    private Timestamp createdByTimestamp;

	    private String modifyBy;

	    @UpdateTimestamp
	    private Timestamp modifyByTimestamp;
	    
	    private Integer roleId;

		public Integer getRoleId() {
			return roleId;
		}

		public void setRoleId(Integer roleId) {
			this.roleId = roleId;
		}

		public Integer getEmployeeId() {
			return employeeId;
		}

		public void setEmployeeId(Integer employeeId) {
			this.employeeId = employeeId;
		}

		public String getEmployeeCode() {
			return employeeCode;
		}

		public void setEmployeeCode(String employeeCode) {
			this.employeeCode = employeeCode;
		}

		public String getEmployeeFirstName() {
			return employeeFirstName;
		}

		public void setEmployeeFirstName(String employeeFirstName) {
			this.employeeFirstName = employeeFirstName;
		}

		public String getEmployeeLastName() {
			return employeeLastName;
		}

		public void setEmployeeLastName(String employeeLastName) {
			this.employeeLastName = employeeLastName;
		}

		public String getEmployeeEmail() {
			return employeeEmail;
		}

		public void setEmployeeEmail(String employeeEmail) {
			this.employeeEmail = employeeEmail;
		}

		public Integer getEmployeeType() {
			return employeeType;
		}

		public void setEmployeeType(Integer employeeType) {
			this.employeeType = employeeType;
		}

		public Date getEmployeeDateOfBirth() {
			return employeeDateOfBirth;
		}

		public void setEmployeeDateOfBirth(Date employeeDateOfBirth) {
			this.employeeDateOfBirth = employeeDateOfBirth;
		}

		public Long getEmployeeContactNumber() {
			return employeeContactNumber;
		}

		public void setEmployeeContactNumber(Long employeeContactNumber) {
			this.employeeContactNumber = employeeContactNumber;
		}

		public Long getEmployeeEmergencyNumber() {
			return employeeEmergencyNumber;
		}

		public void setEmployeeEmergencyNumber(Long employeeEmergencyNumber) {
			this.employeeEmergencyNumber = employeeEmergencyNumber;
		}

		public Date getEmployeeDateOfJoin() {
			return employeeDateOfJoin;
		}

		public void setEmployeeDateOfJoin(Date employeeDateOfJoin) {
			this.employeeDateOfJoin = employeeDateOfJoin;
		}

		public String getEmployeeBloodGroup() {
			return employeeBloodGroup;
		}

		public void setEmployeeBloodGroup(String employeeBloodGroup) {
			this.employeeBloodGroup = employeeBloodGroup;
		}

		public Integer getCompany_id() {
			return company_id;
		}

		public void setCompany_id(Integer company_id) {
			this.company_id = company_id;
		}

		public Integer getEmployeeReportingManager() {
			return employeeReportingManager;
		}

		public void setEmployeeReportingManager(Integer employeeReportingManager) {
			this.employeeReportingManager = employeeReportingManager;
		}

		public Integer getDesignation_id() {
			return designation_id;
		}

		public void setDesignation_id(Integer designation_id) {
			this.designation_id = designation_id;
		}

		public Integer getEmployeeAddress() {
			return employeeAddress;
		}

		public void setEmployeeAddress(Integer employeeAddress) {
			this.employeeAddress = employeeAddress;
		}

		public int getDeleteFlag() {
			return deleteFlag;
		}

		public void setDeleteFlag(int deleteFlag) {
			this.deleteFlag = deleteFlag;
		}

		public String getCreatedBy() {
			return createdBy;
		}

		public void setCreatedBy(String createdBy) {
			this.createdBy = createdBy;
		}

		public Timestamp getCreatedByTimestamp() {
			return createdByTimestamp;
		}

		public void setCreatedByTimestamp(Timestamp createdByTimestamp) {
			this.createdByTimestamp = createdByTimestamp;
		}

		public String getModifyBy() {
			return modifyBy;
		}

		public void setModifyBy(String modifyBy) {
			this.modifyBy = modifyBy;
		}

		public Timestamp getModifyByTimestamp() {
			return modifyByTimestamp;
		}

		public void setModifyByTimestamp(Timestamp modifyByTimestamp) {
			this.modifyByTimestamp = modifyByTimestamp;
		}

		@Override
		public String toString() {
			return "EmployeeDetails [employeeId=" + employeeId + ", employeeCode=" + employeeCode
					+ ", employeeFirstName=" + employeeFirstName + ", employeeLastName=" + employeeLastName
					+ ", employeeEmail=" + employeeEmail + ", employeeType=" + employeeType + ", employeeDateOfBirth="
					+ employeeDateOfBirth + ", employeeContactNumber=" + employeeContactNumber
					+ ", employeeEmergencyNumber=" + employeeEmergencyNumber + ", employeeDateOfJoin="
					+ employeeDateOfJoin + ", employeeBloodGroup=" + employeeBloodGroup + ", company_id=" + company_id
					+ ", employeeReportingManager=" + employeeReportingManager + ", designation_id=" + designation_id
					+ ", employeeAddress=" + employeeAddress + ", deleteFlag=" + deleteFlag + ", createdBy=" + createdBy
					+ ", createdByTimestamp=" + createdByTimestamp + ", modifyBy=" + modifyBy + ", modifyByTimestamp="
					+ modifyByTimestamp + ", roleId=" + roleId + "]";
		}

}
