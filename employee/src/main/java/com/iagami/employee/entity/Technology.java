package com.iagami.employee.entity;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TECHNOLOGY")
public class Technology {
	    @Id
	    private Integer technologyId;

	    @Column(nullable = false, length = 50)
	    private String technologyCode;

	    @Column(nullable = false, length = 100)
	    private String technologyName;

	    @Column(nullable = false)
	    private int deleteFlag = 0;

	    private String createdBy;

	    @CreationTimestamp
	    private Timestamp createdByTimestamp;

	    private String modifyBy;

	    @UpdateTimestamp
	    private Timestamp modifyByTimestamp;
	    
	    private Integer projectId;

		
		public Integer getTechnologyId() {
			return technologyId;
		}

		public void setTechnologyId(Integer technologyId) {
			this.technologyId = technologyId;
		}

		public String getTechnologyCode() {
			return technologyCode;
		}

		public void setTechnologyCode(String technologyCode) {
			this.technologyCode = technologyCode;
		}

		public String getTechnologyName() {
			return technologyName;
		}

		public void setTechnologyName(String technologyName) {
			this.technologyName = technologyName;
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

		public Integer getprojectId() {
			return projectId;
		}

		public void setProject_id(Integer projectId) {
			this.projectId = projectId;
		}

}
