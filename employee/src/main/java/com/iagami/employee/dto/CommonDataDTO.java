package com.iagami.employee.dto;

import java.sql.Timestamp;
import java.util.Date;

public class CommonDataDTO {
	private Date date;
	private  String statusId;
	private Integer deleteFlag;
	private Timestamp createdByTimestamp;
	private Timestamp modifyByTimestamp;
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getStatusId() {
		return statusId;
	}
	public void setStatusId(String statusId) {
		this.statusId = statusId;
	}
	public Integer getDeleteFlag() {
		return deleteFlag;
	}
	public void setDeleteFlag(Integer deleteFlag) {
	    this.deleteFlag = (deleteFlag != null) ? deleteFlag : 0;
	}

	public Timestamp getCreatedByTimestamp() {
		return createdByTimestamp;
	}
	public void setCreatedByTimestamp(Timestamp createdByTimestamp) {
		this.createdByTimestamp = new Timestamp(System.currentTimeMillis());
	}
	public Timestamp getModifyByTimestamp() {
		return modifyByTimestamp;
	}
	public void setModifyByTimestamp(Timestamp modifyByTimestamp) {
		this.modifyByTimestamp = new Timestamp(System.currentTimeMillis());
	}
	
	
}