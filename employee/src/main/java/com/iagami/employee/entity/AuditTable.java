package com.iagami.employee.entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class AuditTable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Integer id;
	@Column(name = "EMPLOYEE_WORK_ID", nullable = false)
	private Integer employeeWorkId;
	@Column(name = "STATUS", nullable = false)
	private String status;
	private String createdBy;
	@Column(name = "CREATED_BY_TIMESTAMP")
	private Timestamp createdByTimeStamp;
	 @Column(name = "REMARK", columnDefinition = "TEXT")
	private String remark;
	
	
	
	
	
	
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getEmployeeWorkId() {
		return employeeWorkId;
	}
	public void setEmployeeWorkId(Integer employeeWorkId) {
		this.employeeWorkId = employeeWorkId;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	public Timestamp getCreatedByTimeStamp() {
		return createdByTimeStamp;
	}
	public void setCreatedByTimeStamp(Timestamp createdByTimeStamp) {
		this.createdByTimeStamp = createdByTimeStamp;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	
}
