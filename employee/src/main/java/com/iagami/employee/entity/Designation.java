package com.iagami.employee.entity;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "EMP_DESIGNATION")
public class Designation {
	

	    
		@Id
	    private Integer designationId;

	    @Column(nullable = false, length = 50)
	    private String designationCode;

	    @Column(nullable = false, length = 100)
	    private String designationName;

	    @Column(nullable = false)
	    private int deleteFlag = 0;

	    private String createdBy;

	    @CreationTimestamp
	    private Timestamp createdByTimestamp;

	    private String modifyBy;

	    @UpdateTimestamp
	    private Timestamp modifyByTimestamp;

		

		public Integer getDesignationId() {
			return designationId;
		}

		public void setDesignationId(Integer designationId) {
			this.designationId = designationId;
		}

		public String getDesignationCode() {
			return designationCode;
		}

		public void setDesignationCode(String designationCode) {
			this.designationCode = designationCode;
		}

		public String getDesignationName() {
			return designationName;
		}

		public void setDesignationName(String designationName) {
			this.designationName = designationName;
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
