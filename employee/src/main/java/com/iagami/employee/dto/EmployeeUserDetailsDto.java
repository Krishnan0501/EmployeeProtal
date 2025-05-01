package com.iagami.employee.dto;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

import com.iagami.employee.entity.Designation;
import com.iagami.employee.entity.EmployeeDetails;
import com.iagami.employee.entity.UserDetailsEntity;

public class EmployeeUserDetailsDto {
	private Integer employeeId;
	private String employeeCode;
	private String employeeFirstName;
	private String employeeLastName;
	private String employeeEmail;
	private Integer employeeType;
	private Date employeeDateOfBirth;
	private Long employeeContactNumber;
	private Long employeeEmergencyNumber;
	private Date employeeDateOfJoin;
	private String employeeBloodGroup;
	private Integer companyId;
	private Integer employeeReportingManager;
	private Integer designationId;
	private Integer employeeAddress;
	private int deleteFlag;
	private String createdBy;
	private Timestamp createdByTimestamp;
	private String modifyBy;
	private Timestamp modifyByTimestamp;

	private Integer userId;
	private String password;
	private LocalDateTime changedPasswordDate;
	private Boolean activeFlag;
	private Boolean userDeleteFlag;
	private Boolean firstLogin;
	private String EmployeeRoleName;
	public EmployeeUserDetailsDto() {}
	public EmployeeUserDetailsDto(EmployeeDetails e, UserDetailsEntity u, Designation d) {
		this.employeeId = e.getEmployeeId();
		this.employeeCode = e.getEmployeeCode();
		this.employeeFirstName = e.getEmployeeFirstName();
		this.employeeLastName = e.getEmployeeLastName();
		this.employeeEmail = e.getEmployeeEmail();
		this.EmployeeRoleName=d.getDesignationName();
		this.employeeType = e.getEmployeeType();
		this.employeeDateOfBirth = e.getEmployeeDateOfBirth();
		this.employeeContactNumber = e.getEmployeeContactNumber();
		this.employeeEmergencyNumber = e.getEmployeeEmergencyNumber();
		this.employeeDateOfJoin = e.getEmployeeDateOfJoin();
		this.employeeBloodGroup = e.getEmployeeBloodGroup();
		this.companyId = e.getCompany_id();
		this.employeeReportingManager = e.getEmployeeReportingManager();
		this.designationId = e.getDesignation_id();
		this.employeeAddress = e.getEmployeeAddress();
		this.deleteFlag = e.getDeleteFlag();
		this.createdBy = e.getCreatedBy();
		this.createdByTimestamp = e.getCreatedByTimestamp();
		this.modifyBy = e.getModifyBy();
		this.modifyByTimestamp = e.getModifyByTimestamp();

		// User Details
		this.userId = u.getUserId();
		this.password = u.getPassword();
		this.changedPasswordDate = u.getChangedPasswordDate();
		this.activeFlag = u.getActiveFlag();
		this.userDeleteFlag = u.getDeleteFlag();
		this.firstLogin = u.getFirstLogin();
	}


	public String getEmployeeRoleName() {
		return EmployeeRoleName;
	}
	public void setEmployeeRoleName(String employeeRoleName) {
		EmployeeRoleName = employeeRoleName;
	}
	// Getters and Setters
	public Integer getEmployeeId() { return employeeId; }
	public void setEmployeeId(Integer employeeId) { this.employeeId = employeeId; }

	public String getEmployeeCode() { return employeeCode; }
	public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

	public String getEmployeeFirstName() { return employeeFirstName; }
	public void setEmployeeFirstName(String employeeFirstName) { this.employeeFirstName = employeeFirstName; }

	public String getEmployeeLastName() { return employeeLastName; }
	public void setEmployeeLastName(String employeeLastName) { this.employeeLastName = employeeLastName; }

	public String getEmployeeEmail() { return employeeEmail; }
	public void setEmployeeEmail(String employeeEmail) { this.employeeEmail = employeeEmail; }

	public Integer getEmployeeType() { return employeeType; }
	public void setEmployeeType(Integer employeeType) { this.employeeType = employeeType; }

	public Date getEmployeeDateOfBirth() { return employeeDateOfBirth; }
	public void setEmployeeDateOfBirth(Date employeeDateOfBirth) { this.employeeDateOfBirth = employeeDateOfBirth; }

	public Long getEmployeeContactNumber() { return employeeContactNumber; }
	public void setEmployeeContactNumber(Long employeeContactNumber) { this.employeeContactNumber = employeeContactNumber; }

	public Long getEmployeeEmergencyNumber() { return employeeEmergencyNumber; }
	public void setEmployeeEmergencyNumber(Long employeeEmergencyNumber) { this.employeeEmergencyNumber = employeeEmergencyNumber; }

	public Date getEmployeeDateOfJoin() { return employeeDateOfJoin; }
	public void setEmployeeDateOfJoin(Date employeeDateOfJoin) { this.employeeDateOfJoin = employeeDateOfJoin; }

	public String getEmployeeBloodGroup() { return employeeBloodGroup; }
	public void setEmployeeBloodGroup(String employeeBloodGroup) { this.employeeBloodGroup = employeeBloodGroup; }

	public Integer getCompanyId() { return companyId; }
	public void setCompanyId(Integer companyId) { this.companyId = companyId; }

	public Integer getEmployeeReportingManager() { return employeeReportingManager; }
	public void setEmployeeReportingManager(Integer employeeReportingManager) { this.employeeReportingManager = employeeReportingManager; }

	public Integer getDesignationId() { return designationId; }
	public void setDesignationId(Integer designationId) { this.designationId = designationId; }

	public Integer getEmployeeAddress() { return employeeAddress; }
	public void setEmployeeAddress(Integer employeeAddress) { this.employeeAddress = employeeAddress; }

	public int getDeleteFlag() { return deleteFlag; }
	public void setDeleteFlag(int deleteFlag) { this.deleteFlag = deleteFlag; }

	public String getCreatedBy() { return createdBy; }
	public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

	public Timestamp getCreatedByTimestamp() { return createdByTimestamp; }
	public void setCreatedByTimestamp(Timestamp createdByTimestamp) { this.createdByTimestamp = createdByTimestamp; }

	public String getModifyBy() { return modifyBy; }
	public void setModifyBy(String modifyBy) { this.modifyBy = modifyBy; }

	public Timestamp getModifyByTimestamp() { return modifyByTimestamp; }
	public void setModifyByTimestamp(Timestamp modifyByTimestamp) { this.modifyByTimestamp = modifyByTimestamp; }

	public Integer getUserId() { return userId; }
	public void setUserId(Integer userId) { this.userId = userId; }

	public String getPassword() { return password; }
	public void setPassword(String password) { this.password = password; }

	public LocalDateTime getChangedPasswordDate() { return changedPasswordDate; }
	public void setChangedPasswordDate(LocalDateTime changedPasswordDate) { this.changedPasswordDate = changedPasswordDate; }

	public Boolean getActiveFlag() { return activeFlag; }
	public void setActiveFlag(Boolean activeFlag) { this.activeFlag = activeFlag; }

	public Boolean getUserDeleteFlag() { return userDeleteFlag; }
	public void setUserDeleteFlag(Boolean userDeleteFlag) { this.userDeleteFlag = userDeleteFlag; }

	public Boolean getFirstLogin() { return firstLogin; }
	public void setFirstLogin(Boolean firstLogin) { this.firstLogin = firstLogin; }
}