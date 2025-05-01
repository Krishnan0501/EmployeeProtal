package com.iagami.employee.dto;

import java.util.List;
public class MonthExcelMultipleDTO {
	
		private  List<Integer> employeeId;
		private Integer month;
		private Integer year;
		public  List<Integer> getEmployeeId() {
			return employeeId;
		}
		public void setEmployeeId( List<Integer> employeeId) {
			this.employeeId = employeeId;
		}
		public Integer getMonth() {
			return month;
		}
		public void setMonth(Integer month) {
			this.month = month;
		}
		public Integer getYear() {
			return year;
		}
		public void setYear(Integer year) {
			this.year = year;
		}
		
	

}
