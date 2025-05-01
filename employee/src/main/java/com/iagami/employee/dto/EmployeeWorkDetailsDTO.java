package com.iagami.employee.dto;

import java.util.Date;

public class EmployeeWorkDetailsDTO {
    private Integer employeeId;
    private String companyName;
    private String projectName;
    private String clientName;
    private String description;
    private Float duration;
    private String statusName;
    private String taskName;
    private Date date;
    private Integer work_Id;
    private String remarks;
    private String teamLeadName;
    

    public String getTeamLeadName() {
		return teamLeadName;
	}

	public void setTeamLeadName(String teamLeadName) {
		this.teamLeadName = teamLeadName;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public Integer getWork_Id() {
		return work_Id;
	}

	public void setWork_Id(Integer work_Id) {
		this.work_Id = work_Id;
	}

	public void setEmployeeId(Integer employeeId) {
		this.employeeId = employeeId;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setDuration(Float duration) {
		this.duration = duration;
	}

	public void setStatusName(String statusName) {
		this.statusName = statusName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public EmployeeWorkDetailsDTO(Integer employeeId, String companyName, String projectName, String clientName,
                                  String description, Float duration, String statusName, String taskName, Date date,Integer id
                                  ,String remarks,String names) {
        this.employeeId = employeeId;
        this.companyName = companyName;
        this.projectName = projectName;
        this.clientName = clientName;
        this.description = description;
        this.duration = duration;
        this.statusName = statusName;
        this.taskName = taskName;
        this.date = date;
        this.work_Id=id;
        this.remarks=remarks;
        this.teamLeadName=names;
    }

    // Getters
    public Integer getEmployeeId() { return employeeId; }
    public String getCompanyName() { return companyName; }
    public String getProjectName() { return projectName; }
    public String getClientName() { return clientName; }
    public String getDescription() { return description; }
    public Float getDuration() { return duration; }
    public String getStatusName() { return statusName; }
    public String getTaskName() { return taskName; }
    public Date getDate() { return date; }
}