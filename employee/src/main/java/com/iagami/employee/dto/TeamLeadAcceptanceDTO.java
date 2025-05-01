package com.iagami.employee.dto;

import java.sql.Timestamp;

public class TeamLeadAcceptanceDTO {
	private Integer workId;
	private String statusCode;
	private Integer userId;
	private Timestamp createdByTimestamp;
	private String remark;
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public Integer getWorkId() {
		return workId;
	}
	public void setWorkId(Integer workId) {
		this.workId = workId;
	}
	public String getStatusCode() {
		return statusCode;
	}
	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Timestamp getCreatedByTimestamp() {
		return createdByTimestamp;
	}
	public void setCreatedByTimestamp(Timestamp createdByTimestamp) {
		this.createdByTimestamp = createdByTimestamp;
	}
	

}
