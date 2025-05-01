package com.iagami.employee.repository;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.iagami.employee.entity.Employee_work;

@Repository
public interface EmployeeWork_Repository extends JpaRepository<Employee_work,Integer> {
	@Query("SELECT COUNT(e) FROM Employee_work e WHERE FUNCTION('DATE', e.date) = :date AND  e.employeeId = :loginperson")
	int checkduplicate(Date date,Integer loginperson);
	@Query("SELECT ew FROM Employee_work ew WHERE FUNCTION('DATE', ew.date) = :date AND ew.employeeId = :loginperson")
	Optional<Employee_work> getDataforUpdate(Date date,Integer loginperson);
	@Query("SELECT ew FROM Employee_work ew WHERE FUNCTION('DATE', ew.date) = :date AND  ew.employeeId = :userId")
	Optional<List<Employee_work>> getTodayDataPrimary(Integer userId, Date date);

	@Query(value = """
			 SELECT ew.ID as id,
			ed.EMPLOYEE_ID, 
			        c.COMPANY_CODE, 
			        p.PROJECT_Name, 
			        ew.CLIENT_NAME, 
			        ew.DESCREPTION, 
			        ew.DURATION,  
			        ts.TASK_NAME,
			        s.STATUS_NAME,
			        ew.REMARK,
			        c.COMPANY_ID,
			        p.PROJECT_ID
			 FROM EMPLOYEE_WORK ew
			 JOIN EMPLOYEE_DETAILS ed ON ew.EMPLOYEE_ID = ed.EMPLOYEE_ID  
			 JOIN COMPANY c ON ew.ENTITY_ID = c.COMPANY_ID
			 JOIN PROJECT p ON ew.PROJECT_ID = p.PROJECT_ID
			 JOIN STATUS s ON ew.STATUS_ID = s.STATUS_ID
			 JOIN TASK_STATUS ts ON ew.TASK_STATUS = ts.TASK_ID
			 WHERE ew.EMPLOYEE_ID = :userId 
			 AND DATE(ew.DATE) = :date
			 AND ew.DELETE_FLAG=0
			 """, nativeQuery = true)
	List<Object[]> getTodayData(@Param("userId") Integer userId, @Param("date") Date date);



	@Query(value = """
			SELECT 
			ew.Id as id,
			ew.EMPLOYEE_ID, 
			       c.COMPANY_CODE, 
			       p.PROJECT_Name, 
			       t.TECHNOLOGY_NAME, 
			       ew.DESCREPTION, 
			       ew.DURATION, 
			       ts.TASK_NAME,
			                  s.STATUS_NAME,
			   ew.REMARK

			FROM EMPLOYEE_WORK ew
			JOIN EMPLOYEE_DETAILS ed ON ew.EMPLOYEE_ID = ed.EMPLOYEE_ID  
			JOIN COMPANY c ON ew.ENTITY_ID = c.COMPANY_ID
			JOIN PROJECT p ON ew.PROJECT_ID = p.PROJECT_ID
			JOIN TECHNOLOGY t ON ew.TECHNOLOGY_ID = t.TECHNOLOGY_ID
			JOIN TASK_STATUS ts ON ew.TASK_STATUS = ts.TASK_ID
			WHERE ed.EMPLOYEE_CODE IN :employeeCodes  
			AND 
			ew.STATUS_ID=:StatusId
			AND ew.DELETE_FLAG = 0
			""", nativeQuery = true)
	List<Object[]> getTeamMembersTodayData(@Param("employeeCodes") List<String> employeeCodes, @Param("StatusId")Integer StatusId);

	@Query(value = """
			    SELECT  
			           ew.Date,
			           c.COMPANY_CODE, 
			           p.PROJECT_NAME, 
			           ew.CLIENT_NAME, 
			           ew.DESCREPTION, 
			           ew.DURATION, 
			           s.STATUS_NAME, 
			           ts.TASK_NAME,
			           ew.REMARK,
			           ew.ID,
			           CASE WHEN EW.STATUS_ID>2 THEN R.MANAGER_NAME ELSE NULL END AS NAMES,
			  							   ew.EMPLOYEE_ID

			    FROM EMPLOYEE_WORK ew
			    JOIN COMPANY c ON ew.ENTITY_ID = c.COMPANY_ID
			    JOIN PROJECT p ON ew.PROJECT_ID = p.PROJECT_ID
			    
			    JOIN STATUS s ON ew.STATUS_ID = s.STATUS_ID
			    JOIN TASK_STATUS ts ON ew.TASK_STATUS = ts.TASK_ID

			    JOIN EMPLOYEE_DETAILS ED ON ED.EMPLOYEE_ID =ew.EMPLOYEE_ID
			    JOIN REPORTING_MANAGER R ON R.MANAGER_ID =ED.EMPLOYEE_REPORTING_MANAGER
			    WHERE ew.EMPLOYEE_ID = :id
			    AND extract(year from ew.date)=:year
			    AND extract(month from ew.date)=:month
			    AND ew.DELETE_FLAG = 0
			    And ew.status_id not in (1,4)
			    order by ew.date
			    
			""", nativeQuery = true)
	Optional<List<Object[]>> getEmployeeData(Integer id,Integer month,Integer year);

	@Modifying
	@Query("UPDATE Employee_work ew SET ew.statusId = :statusId, ew.modifyBy = :modifyBy, ew.modifyByTimestamp = CURRENT_TIMESTAMP, ew.reMarks = :remark WHERE ew.id = :id")
	void updateDataFromTL(@Param("id") Integer id, @Param("statusId") Integer statusId, @Param("modifyBy") String modifyBy, @Param("remark") String remark);



	@Query(value = """
				    SELECT ed.EMPLOYEE_ID
			FROM employee_details ed 
			JOIN reporting_manager rm on rm.MANAGER_ID =ed.EMPLOYEE_REPORTING_MANAGER
			where rm.MANAGER_EMPLOYEE_ID  in (:teamlead) ;
				    """,
				    nativeQuery = true)
	List<Integer> getAllTeamLeadEmployees(List<Integer> teamlead);
	// ew.EMPLOYEE_ID, c.COMPANY_CODE, p.PROJECT_NAME, t.TECHNOLOGY_NAME, ew.DESCREPTION, ew.DURATION, s.STATUS_NAME, ts.TASK_NAME,ew.ID ,ew.DATE,ew.REMARK,CASE WHEN EW.STATUS_ID>2 THEN R.MANAGER_NAME ELSE NULL END AS NAMES 
	@Query(value = "SELECT ew.DATE, c.COMPANY_CODE, p.PROJECT_NAME, ew.CLIENT_NAME, ew.DESCREPTION, ew.DURATION, s.STATUS_NAME, ts.TASK_NAME,ew.REMARK,ew.ID,CASE WHEN EW.STATUS_ID>2 THEN R.MANAGER_NAME ELSE NULL END AS NAMES ,ew.EMPLOYEE_ID " +
			"FROM EMPLOYEE_WORK ew " +
			"JOIN COMPANY c ON ew.ENTITY_ID = c.COMPANY_ID " +
			"JOIN PROJECT p ON ew.PROJECT_ID = p.PROJECT_ID " +
			
			"JOIN STATUS s ON ew.STATUS_ID = s.STATUS_ID " +
			"JOIN TASK_STATUS ts ON ew.TASK_STATUS = ts.TASK_ID " +
			"JOIN EMPLOYEE_DETAILS ED ON ED.EMPLOYEE_ID =ew.EMPLOYEE_ID "+
			"JOIN REPORTING_MANAGER R ON R.MANAGER_ID =ED.EMPLOYEE_REPORTING_MANAGER "+
			"WHERE ew.EMPLOYEE_ID IN (:employeeIds) AND CURDATE() = DATE(ew.date) \r\n" + //
			"    AND ew.DELETE_FLAG=0", nativeQuery = true)
	List<Object[]> getEmployeeWorkDetails(@Param("employeeIds") List<Integer>employeeIds);

	// ew.EMPLOYEE_ID, c.COMPANY_CODE, p.PROJECT_NAME, t.TECHNOLOGY_NAME, ew.DESCREPTION, ew.DURATION, s.STATUS_NAME, ts.TASK_NAME,ew.ID ,ew.DATE,ew.REMARK,CASE WHEN EW.STATUS_ID>2 THEN R.MANAGER_NAME ELSE NULL END AS NAMES 
	@Query(value = "SELECT ew.DATE, c.COMPANY_CODE, p.PROJECT_NAME,ew.CLIENT_NAME , ew.DESCREPTION, ew.DURATION, s.STATUS_NAME, ts.TASK_NAME,ew.REMARK,ew.ID,CASE WHEN EW.STATUS_ID>2 THEN R.MANAGER_NAME ELSE NULL END AS NAMES ,ew.EMPLOYEE_ID " +
			"FROM EMPLOYEE_WORK ew " +
			"JOIN COMPANY c ON ew.ENTITY_ID = c.COMPANY_ID " +
			"JOIN PROJECT p ON ew.PROJECT_ID = p.PROJECT_ID " +
			
			"JOIN STATUS s ON ew.STATUS_ID = s.STATUS_ID " +
			"JOIN TASK_STATUS ts ON ew.TASK_STATUS = ts.TASK_ID " +
			"JOIN EMPLOYEE_DETAILS ED ON ED.EMPLOYEE_ID = ew.EMPLOYEE_ID " +
			"JOIN REPORTING_MANAGER R ON R.MANAGER_ID = ED.EMPLOYEE_REPORTING_MANAGER " +
			"WHERE  ew.DELETE_FLAG = 0 AND ew.EMPLOYEE_ID IN (:employeeIds)  AND CURDATE() = DATE(ew.date) AND ew.DELETE_FLAG=0",
			nativeQuery = true)
	List<Object[]> getEmployeeWorkDetailMemeber(@Param("employeeIds") List<Integer> employeeIds);
	
	
	@Query(value = "SELECT ew.EMPLOYEE_ID, c.COMPANY_Code, p.PROJECT_NAME, ew.CLIENT_NAME, ew.DESCREPTION, ew.DURATION, " +
			"s.STATUS_NAME, ts.TASK_NAME, ew.date ,ew.ID,ew.Remark,CASE WHEN EW.STATUS_ID>2 THEN R.MANAGER_NAME ELSE NULL END AS NAMES ,ew.EMPLOYEE_ID " +
			"FROM EMPLOYEE_WORK ew " +
			"JOIN COMPANY c ON ew.ENTITY_ID = c.COMPANY_ID " +
			"JOIN PROJECT p ON ew.PROJECT_ID = p.PROJECT_ID " +
			
			"JOIN STATUS s ON ew.STATUS_ID = s.STATUS_ID " +
			"JOIN TASK_STATUS ts ON ew.TASK_STATUS = ts.TASK_ID " +
			"JOIN EMPLOYEE_DETAILS ED ON ED.EMPLOYEE_ID =ew.EMPLOYEE_ID "+
			"JOIN REPORTING_MANAGER R ON R.MANAGER_ID =ED.EMPLOYEE_REPORTING_MANAGER "+
			"WHERE ew.EMPLOYEE_ID = :id AND  ew.status_id = 2 AND ew.DELETE_FLAG = 0 ", 
			nativeQuery = true)
	List<Object[]> getEmployeeWorkDetailsMemeber(@Param("id") Integer id, @Param("date")Date date);

	// ew.EMPLOYEE_ID, c.COMPANY_CODE, p.PROJECT_NAME, t.TECHNOLOGY_NAME, ew.DESCREPTION, ew.DURATION, s.STATUS_NAME, ts.TASK_NAME,ew.ID ,ew.DATE,ew.REMARK,CASE WHEN EW.STATUS_ID>2 THEN R.MANAGER_NAME ELSE NULL END AS NAMES 
	@Query(value = "SELECT ew.DATE, c.COMPANY_CODE, p.PROJECT_NAME,ew.CLIENT_NAME , ew.DESCREPTION, ew.DURATION, s.STATUS_NAME, ts.TASK_NAME,ew.REMARK,ew.ID,CASE WHEN EW.STATUS_ID>2 THEN R.MANAGER_NAME ELSE NULL END AS NAMES ,ew.EMPLOYEE_ID " +
			"FROM EMPLOYEE_WORK ew " +
			"JOIN COMPANY c ON ew.ENTITY_ID = c.COMPANY_ID " +
			"JOIN PROJECT p ON ew.PROJECT_ID = p.PROJECT_ID " +
			
			"JOIN STATUS s ON ew.STATUS_ID = s.STATUS_ID " +
			"JOIN TASK_STATUS ts ON ew.TASK_STATUS = ts.TASK_ID " +
			"JOIN EMPLOYEE_DETAILS ED ON ED.EMPLOYEE_ID = ew.EMPLOYEE_ID " +
			"JOIN REPORTING_MANAGER R ON R.MANAGER_ID = ED.EMPLOYEE_REPORTING_MANAGER " +
			"WHERE  ew.DELETE_FLAG = 0 AND ew.EMPLOYEE_ID IN (:employeeIds) AND  ew.status_id = 2 AND ew.DELETE_FLAG=0",
			nativeQuery = true)
	List<Object[]> getEmployeeWorkDetail(@Param("employeeIds") List<Integer> employeeIds);

	@Query(value = "SELECT ew.EMPLOYEE_ID, c.COMPANY_Code, p.PROJECT_NAME, ew.CLIENT_NAME, ew.DESCREPTION, ew.DURATION, " +
			"s.STATUS_NAME, ts.TASK_NAME, ew.date ,ew.ID,ew.Remark,CASE WHEN EW.STATUS_ID>2 THEN R.MANAGER_NAME ELSE NULL END AS NAMES ,ew.EMPLOYEE_ID " +
			"FROM EMPLOYEE_WORK ew " +
			"JOIN COMPANY c ON ew.ENTITY_ID = c.COMPANY_ID " +
			"JOIN PROJECT p ON ew.PROJECT_ID = p.PROJECT_ID " +
			
			"JOIN STATUS s ON ew.STATUS_ID = s.STATUS_ID " +
			"JOIN TASK_STATUS ts ON ew.TASK_STATUS = ts.TASK_ID " +
			"JOIN EMPLOYEE_DETAILS ED ON ED.EMPLOYEE_ID =ew.EMPLOYEE_ID "+
			"JOIN REPORTING_MANAGER R ON R.MANAGER_ID =ED.EMPLOYEE_REPORTING_MANAGER "+
			"WHERE ew.EMPLOYEE_ID = :id AND (CURDATE() = DATE(ew.date) or ew.status_id = 2) AND ew.DELETE_FLAG = 0 ", 
			nativeQuery = true)
	List<Object[]> getEmployeeWorkDetails(@Param("id") Integer id, @Param("date")Date date);

	
	@Query(value = "SELECT ew.EMPLOYEE_ID, c.COMPANY_Code, p.PROJECT_NAME, ew.CLIENT_NAME, ew.DESCREPTION, ew.DURATION, " +
			"s.STATUS_NAME, ts.TASK_NAME, ew.date ,ew.ID,ew.Remark,CASE WHEN EW.STATUS_ID>2 THEN R.MANAGER_NAME ELSE NULL END AS NAMES ,ew.EMPLOYEE_ID " +
			"FROM EMPLOYEE_WORK ew " +
			"JOIN COMPANY c ON ew.ENTITY_ID = c.COMPANY_ID " +
			"JOIN PROJECT p ON ew.PROJECT_ID = p.PROJECT_ID " +
			
			"JOIN STATUS s ON ew.STATUS_ID = s.STATUS_ID " +
			"JOIN TASK_STATUS ts ON ew.TASK_STATUS = ts.TASK_ID " +
			"JOIN EMPLOYEE_DETAILS ED ON ED.EMPLOYEE_ID =ew.EMPLOYEE_ID "+
			"JOIN REPORTING_MANAGER R ON R.MANAGER_ID =ED.EMPLOYEE_REPORTING_MANAGER "+
			"WHERE ew.EMPLOYEE_ID = :id AND ew.DELETE_FLAG = 0 and ew.status_id not in (1,4) and ew.date=:date", 
			nativeQuery = true)
	List<Object[]> getEmployeeWorkDetailsMonthly(@Param("id") Integer id, @Param("date")Date date);
	
	@Query("SELECT SUM(e.duration) FROM Employee_work e WHERE e.employeeId = :id AND e.date = :date AND e.deleteFlag = 0 and e.statusId not in (1,4) and e.statusId=2")
	Float durationOfEmployee(@Param("id") Integer id, @Param("date")Date date);
	
	@Query("SELECT SUM(e.duration) FROM Employee_work e WHERE e.employeeId = :id AND e.date = :date AND e.deleteFlag = 0 and e.statusId not in (1,4)")
	Float durationOfEmployeeMonthly(@Param("id") Integer id, @Param("date")Date date);
	@Query(value = """
			    SELECT  
			           ew.Date,
			           c.COMPANY_CODE, 
			           p.PROJECT_NAME, 
			           ew.CLIENT_NAME,
			           ew.DESCREPTION, 
			           ew.DURATION, 
			           s.STATUS_NAME, 
			           ts.TASK_NAME,
			           ew.REMARK,
			           ew.ID,
			           CASE WHEN EW.STATUS_ID>2 THEN R.MANAGER_NAME ELSE NULL END AS NAMES,
			  ew.EMPLOYEE_ID

			    FROM EMPLOYEE_WORK ew
			    JOIN COMPANY c ON ew.ENTITY_ID = c.COMPANY_ID
			    JOIN PROJECT p ON ew.PROJECT_ID = p.PROJECT_ID
			    
			    
			    JOIN STATUS s ON ew.STATUS_ID = s.STATUS_ID
			    JOIN TASK_STATUS ts ON ew.TASK_STATUS = ts.TASK_ID

			    JOIN EMPLOYEE_DETAILS ED ON ED.EMPLOYEE_ID =ew.EMPLOYEE_ID
			    JOIN REPORTING_MANAGER R ON R.MANAGER_ID =ED.EMPLOYEE_REPORTING_MANAGER
			    WHERE ew.EMPLOYEE_ID = :id 
			    AND extract(year from ew.date)=:year
			    AND extract(month from ew.date)=:month
			    AND ew.DELETE_FLAG = 0
			    order by ew.date
			""", nativeQuery = true)
	Optional<List<Object[]>> getEmployeeData(Integer id);

	@Query(value="""

			SELECT CONCAT(e.employee_FirstName, ' ', e.employee_LastName) AS Name,SUM(w.duration) AS Hours

FROM Employee_work w

JOIN Employee_Details e ON w.employee_Id = e.employee_Id

WHERE 

    w.delete_Flag = 0

    AND e.delete_Flag = 0

    AND w.entity_Id = :companyid

    AND MONTH(w.date) = :month

    AND YEAR(w.date) = :year

GROUP BY e.employee_Id, e.employee_FirstName, e.employee_LastName

ORDER BY Name""", nativeQuery = true)

	Optional<List<Object[]>> fetchEntityWise(Integer companyid, Integer month, Integer year);
	
	
	
	@Query(value = """
		    SELECT 
		        ew.DATE, ed.EMPLOYEE_CODE, p.CLIENT_NAME, 
		        ew.DESCREPTION, ew.DURATION, s.STATUS_NAME
		    FROM employee_work ew
		    JOIN employee_details ed ON ew.EMPLOYEE_ID = ed.EMPLOYEE_ID
		    JOIN project p ON ew.PROJECT_ID = p.PROJECT_ID
		    JOIN STATUS S on ew.status_Id=s.status_id
		    WHERE ew.PROJECT_ID = :projectId
		        AND YEAR(ew.DATE) = :year
		        AND MONTH(ew.DATE) = :month
		        AND ew.DELETE_FLAG = 0
		        AND ed.DELETE_FLAG = 0
		        AND p.DELETE_FLAG = 0
		    ORDER BY ew.DATE
		""", nativeQuery = true)
	List<Object[]> fetchWorkLogsByProjectMonthYear(Integer projectId, Integer month, Integer year);
	@Query(value = """
		    SELECT 
		        COUNT(DISTINCT DATE) * 9 AS TotalWorkingHours
		    FROM employee_work
		    WHERE 
		        (
		            (:#{#monthList != null && !#monthList.isEmpty()} = true AND MONTH(DATE) IN (:monthList))
		            OR
		            (:#{#monthList == null || #monthList.isEmpty()} = true AND MONTH(DATE) = MONTH(CURDATE()))
		        )
		        AND YEAR(DATE) = YEAR(CURDATE())
		""", nativeQuery = true)
		Integer getTotalWorkingHours(@Param("monthList") List<Integer> monthList);


	@Query(value = """
		    SELECT
		        CONCAT(
		            FLOOR(AVG(9 - daily_summary.total_hours)), ':',
		            LPAD(ROUND(MOD(AVG(9 - daily_summary.total_hours), 1) * 60), 2, '0')
		        ) 
		    FROM (
		        SELECT 
		            EMPLOYEE_ID,
		            DATE,
		            SUM(DURATION) AS total_hours
		        FROM employee_work
		        WHERE 
		            (
		                (:#{#monthList != null && !#monthList.isEmpty()} = true AND MONTH(DATE) IN (:monthList))
		                OR
		                (:#{#monthList == null || #monthList.isEmpty()} = true AND MONTH(DATE) = MONTH(CURDATE()))
		            )
		            AND YEAR(DATE) = YEAR(CURDATE())
		        GROUP BY EMPLOYEE_ID, DATE
		        HAVING SUM(DURATION) < 9
		    ) AS daily_summary
		    """, nativeQuery = true)
		String getOverallAvgLostHours(@Param("monthList") List<Integer> monthList);


	@Query(value = """
		    SELECT 
		        p.project_name AS projectName, 
		        COUNT(DISTINCT ew.employee_id) AS employeeCount
		    FROM 
		        employee_work ew 
		    JOIN 
		        project p ON p.project_id = ew.project_id 
		    GROUP BY 
		        p.project_name
		    """, nativeQuery = true)
		List<Map<String, Object>> getEmployeeCountPerProject();

	@Query(value = """
		    SELECT 
		        monthYear,
		        CONCAT(
		            FLOOR(AVG(avgWorkingHoursPerDay)), ':',
		            LPAD(ROUND((AVG(avgWorkingHoursPerDay) - FLOOR(AVG(avgWorkingHoursPerDay))) * 60), 2, '0')
		        ) AS avgWorkingHoursAllEmployees
		    FROM (
		        SELECT 
		            DATE_FORMAT(ew.DATE, '%b %Y') AS monthYear,
		            ew.EMPLOYEE_ID,
		            AVG(ew.DURATION) AS avgWorkingHoursPerDay
		        FROM 
		            employee_work ew
		        GROUP BY 
		            ew.EMPLOYEE_ID, monthYear
		    ) AS employee_avg
		    GROUP BY 
		        monthYear
		""", nativeQuery = true)
		List<Map<String, Object>> getAvgWorkingHoursAllEmployees();
	@Modifying
	@Query("Update Employee_work set deleteFlag=1  where id=:workId")
	int updateDeleteFlagInWorkDetails(Integer workId);
	
	@Query(value = """
		    SELECT 
		        ed.employee_code, 
		        ed.EMPLOYEE_FIRSTNAME, 
		        ROUND(SUM(ew.DURATION), 2) AS total_duration
		    FROM 
		        employee_details ed
		    LEFT JOIN 
		        employee_work ew ON ed.employee_id = ew.employee_id
		    WHERE 
		        ew.project_id = :projectId
		        AND MONTH(ew.date) = :month
		         AND ew.DELETE_FLAG = 0
				AND ed.DELETE_FLAG = 0
		    GROUP BY 
		        ed.employee_code,
		        ed.EMPLOYEE_FIRSTNAME,
		        ew.project_id
		    ORDER BY 
		        ew.project_id, ed.employee_code
		    """, nativeQuery = true)
		List<Object[]> employeeHoursProjectWise(@Param("projectId") Integer projectId, @Param("month") Integer month);
		@Query(value = """
			    SELECT ed.EMPLOYEE_ID
		FROM employee_details ed 
		JOIN reporting_manager rm on rm.MANAGER_ID =ed.EMPLOYEE_REPORTING_MANAGER
		where rm.MANAGER_EMPLOYEE_ID =:userId;
			    """,
			    nativeQuery = true)
List<Integer> getAllTeamLead(@Param("userId") Integer userId);

@Query(value = """
	    SELECT  
	           ew.Date,
	           c.COMPANY_CODE, 
	           p.PROJECT_NAME, 
	           ew.CLIENT_NAME, 
	           ew.DESCREPTION, 
	           ew.DURATION, 
	           s.STATUS_NAME, 
	           ts.TASK_NAME,
	           ew.REMARK,
	           ew.ID,
	           CASE WHEN EW.STATUS_ID>2 THEN R.MANAGER_NAME ELSE NULL END AS NAMES,
	  							   ew.EMPLOYEE_ID

	    FROM EMPLOYEE_WORK ew
	    JOIN COMPANY c ON ew.ENTITY_ID = c.COMPANY_ID
	    JOIN PROJECT p ON ew.PROJECT_ID = p.PROJECT_ID
	    
	    JOIN STATUS s ON ew.STATUS_ID = s.STATUS_ID
	    JOIN TASK_STATUS ts ON ew.TASK_STATUS = ts.TASK_ID

	    JOIN EMPLOYEE_DETAILS ED ON ED.EMPLOYEE_ID =ew.EMPLOYEE_ID
	    JOIN REPORTING_MANAGER R ON R.MANAGER_ID =ED.EMPLOYEE_REPORTING_MANAGER
	    WHERE ew.EMPLOYEE_ID in (:id) 
	    AND extract(year from ew.date)=:year
	    AND extract(month from ew.date)=:month
	    order by ew.date
	""", nativeQuery = true)
Optional<List<Object[]>> getEmployeeDataAll(List<Integer> id,Integer month,Integer year);




















@Query(value = """
    SELECT COUNT(DISTINCT DATE) * 9 AS TotalWorkingHours
    FROM employee_work
    WHERE YEAR(DATE) = :year
""", nativeQuery = true)
Integer getTotalWorkingHours(@Param("year") Integer year);

@Query(value = """
    SELECT
        CONCAT(
            FLOOR(AVG(9 - daily_summary.total_hours)), ':',
            LPAD(ROUND(MOD(AVG(9 - daily_summary.total_hours), 1) * 60), 2, '0')
        ) 
    FROM (
        SELECT 
            EMPLOYEE_ID,
            DATE,
            SUM(DURATION) AS total_hours
        FROM employee_work
        WHERE 
            YEAR(DATE) = :monthList
        GROUP BY EMPLOYEE_ID, DATE
        HAVING SUM(DURATION) < 9
    ) AS daily_summary
    """, nativeQuery = true)
String getOverallAvgLostHours(@Param("monthList") Integer monthList);



@Query(value = """
    SELECT 
        p.project_name AS projectName, 
        COUNT(DISTINCT ew.employee_id) AS employeeCount
    FROM 
        employee_work ew 
    JOIN 
        project p ON p.project_id = ew.project_id 
    WHERE 
        YEAR(ew.date) = :year
    GROUP BY 
        p.project_name
""", nativeQuery = true)
List<Map<String, Object>> getEmployeeCountPerProject(@Param("year") Integer year);

@Query(value = """
  SELECT
DATE_FORMAT(ew.DATE, '%b %Y') AS monthYear,
CONCAT(
FLOOR(SUM(ew.DURATION)), ':',
LPAD(CAST(
    ROUND(
        (SUM(ew.DURATION) - FLOOR(SUM(ew.DURATION))) * 60
    ) AS UNSIGNED), 2, '0'
)
) AS totalWorkingHoursAllEmployees
FROM
employee_work ew
WHERE
YEAR(ew.DATE) = :year
GROUP BY
monthYear;
""", nativeQuery = true)
List<Map<String, Object>> getAvgWorkingHoursAllEmployees(Integer year);


@Query(value = """
    SELECT 
        DATE_FORMAT(DATE, '%b %Y') AS monthYear,
        IFNULL(ROUND(SUM(total_hours - 9), 2), 0) AS above9Hours
    FROM (
        SELECT EMPLOYEE_ID, DATE, SUM(DURATION) AS total_hours
        FROM employee_work
        WHERE YEAR(DATE) = :year
        GROUP BY EMPLOYEE_ID, DATE
        HAVING SUM(DURATION) >= 9
    ) AS daily_summary
    GROUP BY monthYear
""", nativeQuery = true)
List<Map<String, Object>> getAbove9HoursByMonth(@Param("year") Integer year);


@Query(value = """
    SELECT 
        DATE_FORMAT(DATE, '%b %Y') AS monthYear,
        ROUND(ROUND(SUM(9 - total_hours) * 20) / 20, 2) AS balanceTo9Hours
    FROM (
        SELECT EMPLOYEE_ID, DATE, SUM(DURATION) AS total_hours
        FROM employee_work
        WHERE YEAR(DATE) = :year
        GROUP BY EMPLOYEE_ID, DATE
        HAVING SUM(DURATION) < 9
    ) AS daily_summary
    GROUP BY monthYear
""", nativeQuery = true)
List<Map<String, Object>> getBalanceTo9HoursByMonthWise(@Param("year") Integer year);

@Query(value = """
SELECT 
    ed.EMPLOYEE_CODE,
    ed.EMPLOYEE_FIRSTNAME,
    C.COMPANY_CODE AS entityName,
    p.PROJECT_NAME AS projectName,
    ew.CLIENT_NAME AS clientName,
    ew.DESCREPTION AS description,
    ew.DURATION AS duration,
    s.STATUS_NAME AS statusName,
    ew.REMARK AS remarks
FROM employee_details ed
JOIN employee_details manager ON ed.EMPLOYEE_REPORTING_MANAGER = manager.EMPLOYEE_ID
JOIN employee_work ew ON ed.EMPLOYEE_ID = ew.EMPLOYEE_ID
JOIN project p ON ew.PROJECT_ID = p.PROJECT_ID
JOIN status s ON ew.STATUS_ID = s.STATUS_ID
JOIN company C ON ew.ENTITY_ID = C.COMPANY_ID
WHERE manager.EMPLOYEE_ID = (select manager_id from reporting_manager where MANAGER_EMPLOYEE_ID=:userId) 
  AND ew.STATUS_ID IN (3, 4) 
  AND DAY(ew.MODIFY_BY_TIMESTAMP) =:date
  AND MONTH(ew.MODIFY_BY_TIMESTAMP) =:month
  AND YEAR(ew.MODIFY_BY_TIMESTAMP) =:year
  order by ew.MODIFY_BY_TIMESTAMP desc;
""", nativeQuery = true)
List<Object[]> historyData(Integer userId, Integer date, Integer month, Integer year);


}