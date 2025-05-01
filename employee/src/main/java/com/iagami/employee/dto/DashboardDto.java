package com.iagami.employee.dto;

public class DashboardDto {
private Integer totalWorkingHours;
private String lossHours;
private Object projectMembers;
private Object averageWorking;
private Object monthWorkingBalanceHour;
private Object monthWorkingExtraHour;
public Object getMonthWorkingBalanceHour() {
	return monthWorkingBalanceHour;
}
public void setMonthWorkingBalanceHour(Object monthWorkingBalanceHour) {
	this.monthWorkingBalanceHour = monthWorkingBalanceHour;
}
public Object getMonthWorkingExtraHour() {
	return monthWorkingExtraHour;
}
public void setMonthWorkingExtraHour(Object monthWorkingExtraHour) {
	this.monthWorkingExtraHour = monthWorkingExtraHour;
}
public Integer getTotalWorkingHours() {
	return totalWorkingHours;
}
public void setTotalWorkingHours(Integer totalWorkingHours) {
	this.totalWorkingHours = totalWorkingHours;
}
public String getLossHours() {
	return lossHours;
}
public void setLossHours(String lossHours) {
	this.lossHours = lossHours;
}
public Object getProjectMembers() {
	return projectMembers;
}
public void setProjectMembers(Object projectMembers) {
	this.projectMembers = projectMembers;
}
public Object getAverageWorking() {
	return averageWorking;
}
public void setAverageWorking(Object averageWorking) {
	this.averageWorking = averageWorking;
}
}