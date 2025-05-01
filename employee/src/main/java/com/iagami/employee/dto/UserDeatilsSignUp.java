package com.iagami.employee.dto;

import java.time.LocalDateTime;

import com.iagami.employee.entity.UserDetailsEntity;

public class UserDeatilsSignUp {
    private Integer userId;
    private String password;
    private String emailId;
    private LocalDateTime changedPasswordDate;
    private Boolean activeFlag;
    private Boolean deleteFlag;
    private Boolean firstLogin;
    private String employeeCode; // To reference the Employee entity

    // Default Constructor
    public UserDeatilsSignUp() {}

    // Constructor to map from UserDetails entity
    public UserDeatilsSignUp(UserDetailsEntity userDetails) {
        this.userId = userDetails.getUserId();
        this.password = userDetails.getPassword();
        this.emailId = userDetails.getEmailId();
        this.changedPasswordDate = userDetails.getChangedPasswordDate();
        this.activeFlag = userDetails.getActiveFlag();
        this.deleteFlag = userDetails.getDeleteFlag();
        this.firstLogin = userDetails.getFirstLogin();
        this.employeeCode = userDetails.getEmployee().getEmployeeCode(); // Extracting Employee Code
    }

    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public LocalDateTime getChangedPasswordDate() {
        return changedPasswordDate;
    }

    public void setChangedPasswordDate(LocalDateTime changedPasswordDate) {
        this.changedPasswordDate = changedPasswordDate;
    }

    public Boolean getActiveFlag() {
        return activeFlag;
    }

    public void setActiveFlag(Boolean activeFlag) {
        this.activeFlag = activeFlag;
    }

    public Boolean getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(Boolean deleteFlag) {
        this.deleteFlag = deleteFlag;
    }

    public Boolean getFirstLogin() {
        return firstLogin;
    }

    public void setFirstLogin(Boolean firstLogin) {
        this.firstLogin = firstLogin;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }
}