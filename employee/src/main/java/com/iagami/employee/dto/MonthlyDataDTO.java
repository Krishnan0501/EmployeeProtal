package com.iagami.employee.dto;
import java.util.Date;

public class MonthlyDataDTO {
    private Date date;    
    private String entityName;
    private String projectName;
    private String clientName;    
    private String description;
    private Float duration;
    private String status;
    private String taskStatus;
    private Integer work_Id;
    private String remark;
    private String teamLeadName;
 private Integer employee_id;
 
    public Integer getEmployee_id() {
	return employee_id;
}

public void setEmployee_id(Integer employee_id) {
	this.employee_id = employee_id;
}

	public Integer getWork_Id() {
		return work_Id;
	}

	public void setWork_Id(Integer work_Id) {
		this.work_Id = work_Id;
	}

	public String getTeamLeadName() {
		return teamLeadName;
	}

	public void setTeamLeadName(String teamLeadName) {
		teamLeadName = teamLeadName;
	}

	// 🔹 Constructor
    public MonthlyDataDTO(Date date, String entityName, String projectName, String clientName, 
                          String description, float duration, String status, String taskStatus, String remark,Integer work_id,String name,Integer ids) {
        this.date = date;
        this.entityName = entityName;
        this.projectName = projectName;
        this.clientName = clientName;
        this.description = description;
        this.duration = duration;
        this.status = status;
        this.taskStatus = taskStatus;
        this.remark = remark;
        this.work_Id=work_id;
        this.teamLeadName=name;
        this.employee_id=ids;
    }

    // 🔹 Getters and Setters
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getClientName() { return clientName; }
    public void setClientName(String technologyName) { this.clientName = technologyName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Float getDuration() { return duration; }
    public void setDuration(Float duration) { this.duration = duration; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTaskStatus() { return taskStatus; }
    public void setTaskStatus(String taskStatus) { this.taskStatus = taskStatus; }

    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }

    // 🔹 ToString for Debugging
    @Override
    public String toString() {
        return "MonthlyDataDTO{" +
                "date=" + date +
                ", entityName='" + entityName + '\'' +
                ", projectName='" + projectName + '\'' +
                ", clientName='" + clientName + '\'' +
                ", description='" + description + '\'' +
                ", duration=" + duration +
                ", status='" + status + '\'' +
                ", taskStatus='" + taskStatus + '\'' +
                ", remark='" + remark + '\'' +
                '}';
    }
}