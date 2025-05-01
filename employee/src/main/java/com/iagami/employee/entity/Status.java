package com.iagami.employee.entity;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "STATUS")
public class Status {

	    @Id
	    private Integer statusId;

	    @Column(nullable = false, length = 50)
	    private String statusCode;

	    @Column(nullable = false, length = 100)
	    private String statusName;

	    @Column(nullable = false)
	    private int deleteFlag = 0;

	    private String createdBy;

	    @CreationTimestamp
	    private Timestamp createdByTimestamp;

	    private String modifyBy;

	    @UpdateTimestamp
	    private Timestamp modifyByTimestamp;

	

		public Integer getStatusId() {
			return statusId;
		}

		public void setStatusId(Integer statusId) {
			this.statusId = statusId;
		}

		public String getStatusCode() {
			return statusCode;
		}

		public void setStatusCode(String statusCode) {
			this.statusCode = statusCode;
		}

		public String getStatusName() {
			return statusName;
		}

		public void setStatusName(String statusName) {
			this.statusName = statusName;
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
