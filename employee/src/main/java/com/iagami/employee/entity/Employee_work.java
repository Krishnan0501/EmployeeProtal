package com.iagami.employee.entity;

import java.sql.Timestamp;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "EMPLOYEE_WORK")
public class Employee_work {
	

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Integer id;

	    
	    @Column(name = "employee_id", nullable = false)
	    private Integer employeeId;

	    @Column(nullable = false)
	    private Date date;

	    @Column(nullable = false)
	    private Integer entityId;
	    
	  @Column(name = "project_id", nullable = false)
	    private Integer projectId;

	   
	    @Column(name = "CLIENT_NAME", nullable = false)
	    private String clientName;

	    @Column(nullable = false, name= "DESCREPTION")
	    private String description;

	    @Column(nullable = false)
	    private float duration;

	    @Column(name = "status_id", nullable = false)
	    private Integer statusId;

	    @Column(nullable = false)
	    private Integer deleteFlag = 0;

	    private String createdBy;

	    @CreationTimestamp
	    private Timestamp createdByTimestamp;

	    private String modifyBy;

	    @UpdateTimestamp
	    private Timestamp modifyByTimestamp;
	    
	    @Column(nullable = false,name="TASK_STATUS")
	    private Integer taskStatus;
	    
	    @Column(name="REMARK",nullable = true)
	    private String reMarks;

		public Integer getId() {
			return id;
		}

		public void setId(Integer id) {
			this.id = id;
		}

		public Integer getEmployeeId() {
			return employeeId;
		}

		public void setEmployeeId(Integer employeeId) {
			this.employeeId = employeeId;
		}

		public Date getDate() {
			return date;
		}

		public void setDate(Date date) {
			this.date = date;
		}

		public Integer getEntityId() {
			return entityId;
		}

		public void setEntityId(Integer entityId) {
			this.entityId = entityId;
		}

		public Integer getProjectId() {
			return projectId;
		}

		public void setProjectId(Integer projectId) {
			this.projectId = projectId;
		}

		public String getClientName() {
			return clientName;
		}

		public void setClientName(String clientName) {
			this.clientName = clientName;
		}

		public String getDescription() {
			return description;
		}

		public void setDescription(String description) {
			this.description = description;
		}

		public float getDuration() {
			return duration;
		}

		public void setDuration(float duration) {
			this.duration = duration;
		}

		public Integer getStatusId() {
			return statusId;
		}

		public void setStatusId(Integer statusId) {
			this.statusId = statusId;
		}

		public Integer getDeleteFlag() {
			return deleteFlag;
		}

		public void setDeleteFlag(Integer deleteFlag) {
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

		public Integer getTaskStatus() {
			return taskStatus;
		}

		public void setTaskStatus(Integer taskStatus) {
			this.taskStatus = taskStatus;
		}

		public String getReMarks() {
			return reMarks;
		}

		public void setReMarks(String reMarks) {
			this.reMarks = reMarks;
		}

		@Override
		public String toString() {
			return "Employee_work [id=" + id + ", employeeId=" + employeeId + ", date=" + date + ", entityId="
					+ entityId + ", projectId=" + projectId + ", clientName=" + clientName + ", description="
					+ description + ", duration=" + duration + ", statusId=" + statusId + ", deleteFlag=" + deleteFlag
					+ ", createdBy=" + createdBy + ", createdByTimestamp=" + createdByTimestamp + ", modifyBy="
					+ modifyBy + ", modifyByTimestamp=" + modifyByTimestamp + ", taskStatus=" + taskStatus
					+ ", reMarks=" + reMarks + "]";
		}

		

}
