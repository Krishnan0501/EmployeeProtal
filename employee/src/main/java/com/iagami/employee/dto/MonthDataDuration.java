package com.iagami.employee.dto;

import java.util.Date;

public class MonthDataDuration {
	private  String name;
public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
private Float duration;
private Date date;
private Object data;
public Float getDuration() {
	return duration;
}
public void setDuration(Float duration) {
	this.duration = duration;
}
public Date getDate() {
	return date;
}
public void setDate(Date date) {
	this.date = date;
}
public Object getData() {
	return data;
}
public void setData(Object data) {
	this.data = data;
}
}