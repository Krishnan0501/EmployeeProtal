package com.iagami.employee.entity;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="ROLE")
public class Role {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Integer id;
	@Column(name = "TYPE", nullable = false)
	private String type;
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

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
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
