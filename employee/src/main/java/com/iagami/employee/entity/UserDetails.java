package com.iagami.employee.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_details")
public class UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email_id", unique = true, nullable = false)
    private String emailId;

    @Column(name = "changed_password_date")
    private LocalDateTime changedPasswordDate;

    @Column(name = "active_flag", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean activeFlag = true;

    @Column(name = "delete_flag", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean deleteFlag = false;

    @Column(name = "first_login", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean firstLogin = true;

    @ManyToOne
    @JoinColumn(name = "employee_code", referencedColumnName = "employeeCode", nullable = false)
    private EmployeeDetails employee;

    public UserDetails() {}

    public UserDetails(String password, String emailId, LocalDateTime changedPasswordDate, 
                       Boolean activeFlag, Boolean deleteFlag, Boolean firstLogin, EmployeeDetails employee) {
        this.password = password;
        this.emailId = emailId;
        this.changedPasswordDate = changedPasswordDate;
        this.activeFlag = activeFlag;
        this.deleteFlag = deleteFlag;
        this.firstLogin = firstLogin;
        this.employee = employee;
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

    public EmployeeDetails getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeDetails employee) {
        this.employee = employee;
    }
    
}