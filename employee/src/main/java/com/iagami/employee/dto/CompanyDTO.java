package com.iagami.employee.dto;

import java.io.Serializable;

public class CompanyDTO implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 4305150178567094248L;
	private Integer entityId;
	private String entityCode;
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
	
	
	

}
