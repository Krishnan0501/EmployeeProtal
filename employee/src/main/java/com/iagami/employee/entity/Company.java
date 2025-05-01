package com.iagami.employee.entity;


import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "COMPANY")
public class Company {
	    @Id
	    @Column(name = "COMPANY_ID")
	    private Integer entityId;
	    
	    @Column(nullable = false, length = 50,name = "COMPANY_CODE")
	    private String entityCode;

	    @Column(name = "COMPANY_NAME", nullable = false, length = 100)
	    private String entityName;

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

		public Integer getEntityId() {
			return entityId;
		}

		public void setEntityId(Integer entityId) {
			this.entityId = entityId;
		}

		public String getEntityCode() {
			return entityCode;
		}

		public void setEntityCode(String entityCode) {
			this.entityCode = entityCode;
		}

		public String getEntityName() {
			return entityName;
		}

		public void setEntityName(String entityName) {
			this.entityName = entityName;
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
