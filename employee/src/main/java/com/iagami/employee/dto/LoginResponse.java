package com.iagami.employee.dto;

import java.util.List;
import java.util.Map;

public class LoginResponse {
    private String jwtToken;

    private String username;
    private List<String> roles;
    private String password;
    private boolean firstlogin;
    private Integer employeeId;
    private Integer entityId;
    private String entityCode;
    private Integer roleId;
    
   
    public Integer getRoleId() {
		return roleId;
	}
	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public boolean getFirstlogin() {
		return firstlogin;
	}
	public void setFirstlogin(boolean firstlogin) {
		this.firstlogin = firstlogin;
	}
	public Integer getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(Integer employeeId) {
		this.employeeId = employeeId;
	}
	public Integer getEntityId() {
		return entityId;
	}
	public void setEntityId(Integer entityId) {
		this.entityId = entityId;
	}
	public String getEntityCode() {
		return entityCode;
	}
	public void setEntityCode(String entityCode) {
		this.entityCode = entityCode;
	}
	private List<Map<String, Object>> screenAccess;
    
   
	public List<Map<String, Object>> getScreenAccess() {
		return screenAccess;
	}
	public void setScreenAccess(List<Map<String, Object>> screenAccess) {
		this.screenAccess = screenAccess;
	}
	public String getJwtToken() {
		return jwtToken;
	}
	public void setJwtToken(String jwtToken) {
		this.jwtToken = jwtToken;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public List<String> getRoles() {
		return roles;
	}
	public void setRoles(List<String> roles) {
		this.roles = roles;
	}
	

   
}


