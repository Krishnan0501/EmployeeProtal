package com.iagami.employee.dto;

import java.io.Serializable;
import java.util.Date;

public class TimesheetDTO extends CommonDataDTO implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 8971652332918718019L;
	private Date todayDate;
	private Integer userId;
	private Integer workId;
	private Integer entityId;
	private Integer projectId;
	private String clientName;
	
	public String getClientName() {
		return clientName;
	}

	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

	private String description;
	private float duration;
	private Integer taskStatus;
	private String statusCode;
	
	


	public Date getTodayDate() {
		return todayDate;
	}

	public void setTodayDate(Date todayDate) {
		this.todayDate = todayDate;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public Integer getEntityId() {
		return entityId;
	}

	public void setEntityId(Integer entityId) {
		this.entityId = entityId;
	}

	public Integer getProjectId() {
		return projectId;
	}

	public void setProjectId(Integer projectId) {
		this.projectId = projectId;
	}

	

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public float getDuration() {
		return duration;
	}

	public void setDuration(float duration) {
		this.duration = duration;
	}

	public Integer getTaskStatus() {
		return taskStatus;
	}

	public void setTaskStatus(Integer taskStatus) {
		this.taskStatus = taskStatus;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
	

	public String getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}

	@Override
	public String toString() {
		return "TimesheetDTO [todayDate=" + todayDate + ", userId=" + userId + ", entityId=" + entityId + ", projectId="
				+ projectId + " description=" + description + ", duration="
				+ duration + ", taskStatus=" + taskStatus + ", statusCode=" + statusCode + "]";
	}

	public Integer getWorkId() {
		return workId;
	}

	public void setWorkId(Integer workId) {
		this.workId = workId;
	}




}
