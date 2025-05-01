package com.iagami.employee.entity;

import java.sql.Timestamp;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "fingerprintdata")
public class FingerprintData {

    @Override
	public String toString() {
		return "FingerprintData [id=" + id + ", employeeCode=" + employeeCode + ", date=" + date + ", inTime=" + inTime
				+ ", outTime=" + outTime + ", hours=" + hours + "]";
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

	 @Column(name = "ENTITY_CODE", nullable = false)
	    private String entityCode;
	
    public String getEntityCode() {
		return entityCode;
	}

	public void setEntityCode(String entityCode) {
		this.entityCode = entityCode;
	}

	@Column(name = "EPMLOYEE_CODE", nullable = false)
    private String employeeCode;

  
    @Column(name = "DATE", nullable = false)
    private Date date;

    @Column(name = "INTIME")
    private Double inTime;

    @Column(name = "OUTTIME")
    private Double outTime;

    @Column(name = "HOURS", nullable = false)
    private Double hours;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Double getInTime() {
		return inTime;
	}

	public void setInTime(Double inTime) {
		this.inTime = inTime;
	}

	public Double getOutTime() {
		return outTime;
	}

	public void setOutTime(Double outTime) {
		this.outTime = outTime;
	}

	public Double getHours() {
		return hours;
	}

	public void setHours(Double hours) {
		this.hours = hours;
	}
    
    
    
    
}