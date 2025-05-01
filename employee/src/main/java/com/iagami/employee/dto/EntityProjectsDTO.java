package com.iagami.employee.dto;

import java.io.Serializable;

public class EntityProjectsDTO implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -3153270584309369288L;
	private Integer projectId;
	private String projectCode;
	private String clientName;
	
	public String getClientName() {
		return clientName;
	}
	public void setClientName(String clientName) {
		this.clientName = clientName;
	}
	public Integer getProjectId() {
		return projectId;
	}
	public void setProjectId(Integer projectId) {
		this.projectId = projectId;
	}
	public String getProjectCode() {
		return projectCode;
	}
	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}
	
	

}
