package com.iagami.employee.dto;

public class ProfileDeatilsDTO {
	
	private Integer userId;
	private String title;
	private String employeeId;
	private String currentProject;
	private String address;
	private String reportTo;
	private String employeeType;
	private String[] skills;
	private Object contact;
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(String employeeId) {
		this.employeeId = employeeId;
	}
	public String getCurrentProject() {
		return currentProject;
	}
	public void setCurrentProject(String currentProject) {
		this.currentProject = currentProject;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getReportTo() {
		return reportTo;
	}
	public void setReportTo(String reportTo) {
		this.reportTo = reportTo;
	}
	public String getEmployeeType() {
		return employeeType;
	}
	public void setEmployeeType(String employeeType) {
		this.employeeType = employeeType;
	}
	public String[] getSkills() {
		return skills;
	}
	public void setSkills(String[] skills) {
		this.skills = skills;
	}
	public Object getContact() {
		return contact;
	}
	public void setContact(Object contact) {
		this.contact = contact;
	}
	

}
