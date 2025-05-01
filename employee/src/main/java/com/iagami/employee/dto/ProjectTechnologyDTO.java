package com.iagami.employee.dto;

import java.io.Serializable;

public class ProjectTechnologyDTO implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -5009464697566948849L;
	private int technologyId;
	private String technologyName;
	public int getTechnologyId() {
		return technologyId;
	}
	public void setTechnologyId(int technologyId) {
		this.technologyId = technologyId;
	}
	public String getTechnologyName() {
		return technologyName;
	}
	public void setTechnologyName(String technologyName) {
		this.technologyName = technologyName;
	}
	
	

}
