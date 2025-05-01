package com.iagami.employee.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "TeamLead_Project_MAPPING")
public class TeamLeadProjectMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "TeamLeadId", nullable = false)
    private Integer teamLeadId;

    @Column(name = "ProjectId", nullable = false)
    private Integer projectId;

    @Column(name = "DELETE_FLAG", nullable = false)
    private Integer deleteFlag = 0;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "CREATED_BY_TIMESTAMP")
    private Timestamp createdByTimestamp;

    @Column(name = "MODIFY_BY")
    private String modifyBy;

    @Column(name = "MODIFY_BY_TIMESTAMP")
    private Timestamp modifyByTimestamp;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getTeamLeadId() {
		return teamLeadId;
	}

	public void setTeamLeadId(Integer teamLeadId) {
		this.teamLeadId = teamLeadId;
	}

	public Integer getProjectId() {
		return projectId;
	}

	public void setProjectId(Integer projectId) {
		this.projectId = projectId;
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
    
    
}
