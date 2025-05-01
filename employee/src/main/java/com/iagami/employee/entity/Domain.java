package com.iagami.employee.entity;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="DOMAIN")
public class Domain {
	 @Id
	    @Column(name = "ID")
	    private Integer id;
	    
	    @Column(nullable = false, length = 50,name = "DOMAIN_NAME")
	    private String domainName;

	    @Column(name = "DELETE_FLAG", nullable = false)
	    private int deleteFlag;

	    @Column(name = "CREATED_BY")
	    private String createdBy;

	    @CreationTimestamp
	    @Column(name = "CREATED_BY_TIMESTAMP")
	    private Timestamp createdByTimestamp;

	    @Column(name = "MODIFY_BY")
	    private String modifyBy;

	    @UpdateTimestamp
	    @Column(name = "MODIFY_BY_TIMESTAMP")
	    private Timestamp modifyByTimestamp;

}
