package com.iagami.employee.dto;

import java.util.List;

public class EmployeeWorkResponseDTO {
	private Integer employeeId;
	private List<ReturnTodayDataDTO1> tasks;
	public Integer getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(Integer employeeId) {
		this.employeeId = employeeId;
	}
	public List<ReturnTodayDataDTO1> getTasks() {
		return tasks;
	}
	public void setTasks(List<ReturnTodayDataDTO1> tasks) {
		this.tasks = tasks;
	}

}
