package com.iagami.employee.entity;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
@Entity
public class ReportingManager {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name ="MANAGER_ID")
	private Integer reportingManagerId;
	@Column(name="MANAGER_NAME")
	private String reportingManagerName;
	@Column(name="MANAGER_EMPLOYEE_ID")
	private Integer reportingManagerEmpId;
	@Column(name = "DELETE_FLAG", nullable = false)
	private int deleteFlag;

	@Column(name = "CREATED_BY")
	private String createdBy;

	@CreationTimestamp
	@Column(name = "CREATED_BY_TIMESTAMP")
	private Timestamp createdByTimestamp;

	@Column(name = "MODIFY_BY")
	private String modifyBy;

	@UpdateTimestamp
	@Column(name = "MODIFY_BY_TIMESTAMP")
	private Timestamp modifyByTimestamp;

	public Integer getReportingManagerId() {
		return reportingManagerId;
	}

	public void setReportingManagerId(Integer reportingManagerId) {
		this.reportingManagerId = reportingManagerId;
	}

	public String getReportingManagerName() {
		return reportingManagerName;
	}

	public void setReportingManagerName(String reportingManagerName) {
		this.reportingManagerName = reportingManagerName;
	}

	public Integer getReportingManagerEmpId() {
		return reportingManagerEmpId;
	}

	public void setReportingManagerEmpId(Integer reportingManagerEmpId) {
		this.reportingManagerEmpId = reportingManagerEmpId;
	}

	public int getDeleteFlag() {
		return deleteFlag;
	}

	public void setDeleteFlag(int deleteFlag) {
		this.deleteFlag = deleteFlag;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public Timestamp getCreatedByTimestamp() {
		return createdByTimestamp;
	}

	public void setCreatedByTimestamp(Timestamp createdByTimestamp) {
		this.createdByTimestamp = createdByTimestamp;
	}

	public String getModifyBy() {
		return modifyBy;
	}

	public void setModifyBy(String modifyBy) {
		this.modifyBy = modifyBy;
	}

	public Timestamp getModifyByTimestamp() {
		return modifyByTimestamp;
	}

	public void setModifyByTimestamp(Timestamp modifyByTimestamp) {
		this.modifyByTimestamp = modifyByTimestamp;
	}
	
	


}
