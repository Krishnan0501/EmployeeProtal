package com.iagami.employee.dto;

public class UserDetailsDto {
	private Integer employeeId;
    private String employeeCode;
	private String emailId;
    private String password;
    private Boolean firstLogin;
    private Integer employeeRoleId;
    private String employeeRoleName;
    public UserDetailsDto() {}
    public UserDetailsDto(EmployeeUserDetailsDto employeeUserDetailsDto) {
        this.employeeId = employeeUserDetailsDto.getEmployeeId();
        this.employeeCode = employeeUserDetailsDto.getEmployeeCode();
        this.emailId = employeeUserDetailsDto.getEmployeeEmail();
        this.password = employeeUserDetailsDto.getPassword();
        this.firstLogin = employeeUserDetailsDto.getFirstLogin();
        this.employeeRoleId = employeeUserDetailsDto.getDesignationId(); 
        this.employeeRoleName=employeeUserDetailsDto.getEmployeeRoleName();
    }

	public String getEmployeeRoleName() {
		return employeeRoleName;
	}
	public void setEmployeeRoleName(String employeeRoleName) {
		this.employeeRoleName = employeeRoleName;
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
	public String getEmailId() {
		return emailId;
	}
	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Boolean getFirstLogin() {
		return firstLogin;
	}
	public void setFirstLogin(Boolean firstLogin) {
		this.firstLogin = firstLogin;
	}
	public Integer getEmployeeRoleId() {
		return employeeRoleId;
	}
	public void setEmployeeRoleId(Integer employeeRoleId) {
		this.employeeRoleId = employeeRoleId;
	}



   
}
