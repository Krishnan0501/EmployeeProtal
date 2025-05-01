package com.iagami.employee.dto;

import java.io.Serializable;

public class ApiResponse<T> implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 8526589547188893885L;
	private String responseCode;
    private String responseMessage;
    private Object data;
	public String getResponseCode() {
		return responseCode;
	}
	public void setResponseCode(String responseCode) {
		this.responseCode = responseCode;
	}
	public String getResponseMessage() {
		return responseMessage;
	}
	public void setResponseMessage(String responseMessage) {
		this.responseMessage = responseMessage;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}


}
