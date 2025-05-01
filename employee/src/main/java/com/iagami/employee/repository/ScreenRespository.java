package com.iagami.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.iagami.employee.entity.Screen;
@Repository
public interface ScreenRespository extends JpaRepository<Screen,Integer> {
	

}
