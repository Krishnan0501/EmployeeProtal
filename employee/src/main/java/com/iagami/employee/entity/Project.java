package com.iagami.employee.entity;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "PROJECT")
public class Project {

	    @Id
	    private Integer projectId;

	    @Column(nullable = false, length = 100)
	    private String projectCode;

	    @Column(nullable = false, length = 100)
	    private String projectName;

	    @Column(nullable = false, length = 100)
	    private String clientName;

	    @Column(nullable = false)
	    private int deleteFlag = 0;

	    private String createdBy;

	    @CreationTimestamp
	    private Timestamp createdByTimestamp;

	    private String modifyBy;

	    @UpdateTimestamp
	    private Timestamp modifyByTimestamp;

	    
	    @Column(name = "company_id", nullable = false)
	    private Integer entityId;



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


		public String getProjectName() {
			return projectName;
		}


		public void setProjectName(String projectName) {
			this.projectName = projectName;
		}


		public String getClientName() {
			return clientName;
		}


		public void setClientName(String clientName) {
			this.clientName = clientName;
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


		public Integer getentityId() {
			return entityId;
		}


		public void setCompany(Integer entityId) {
			this.entityId = entityId;
		}


		@Override
		public String toString() {
			return "Project [projectId=" + projectId + ", projectCode=" + projectCode + ", projectName=" + projectName
					+ ", clientName=" + clientName + ", deleteFlag=" + deleteFlag + ", createdBy=" + createdBy
					+ ", createdByTimestamp=" + createdByTimestamp + ", modifyBy=" + modifyBy + ", modifyByTimestamp="
					+ modifyByTimestamp + ", entityId=" + entityId + "]";
		}

}
