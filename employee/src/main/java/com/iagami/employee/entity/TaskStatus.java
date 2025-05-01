package com.iagami.employee.entity;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TASK_STATUS")
public class TaskStatus {
	 @Id
	    @Column(name = "TASK_ID")
	    private Integer taskId;

	    @Column(name = "TASK_CODE", nullable = false, length = 20)
	    private String taskCode;

	    @Column(name = "TASK_NAME", nullable = false, length = 100)
	    private String taskName;


	    @Column(nullable = false)
	    private int deleteFlag = 0;

	    private String createdBy;

	    @CreationTimestamp
	    private Timestamp createdByTimestamp;

	    private String modifyBy;

	    @UpdateTimestamp
	    private Timestamp modifyByTimestamp;

		public Integer getTaskId() {
			return taskId;
		}

		public void setTaskId(Integer taskId) {
			this.taskId = taskId;
		}

		public String getTaskCode() {
			return taskCode;
		}

		public void setTaskCode(String taskCode) {
			this.taskCode = taskCode;
		}

		public String getTaskName() {
			return taskName;
		}

		public void setTaskName(String taskName) {
			this.taskName = taskName;
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
