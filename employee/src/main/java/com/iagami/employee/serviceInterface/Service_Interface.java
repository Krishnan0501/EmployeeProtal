package com.iagami.employee.serviceInterface;

import java.text.ParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.iagami.employee.dto.CompanyDTO;
import com.iagami.employee.dto.DashboardDto;
import com.iagami.employee.dto.DateFormatDto;
import com.iagami.employee.dto.EmpIdCode;
import com.iagami.employee.dto.EmployeeDetailDTO;
import com.iagami.employee.dto.EntityProjectsDTO;
import com.iagami.employee.dto.HistoryDto;
import com.iagami.employee.dto.LoginDto;
import com.iagami.employee.dto.MonthDataDuration;
import com.iagami.employee.dto.MonthExcelDTO;
import com.iagami.employee.dto.MonthlyDataDTO;
import com.iagami.employee.dto.ReturnTodayDataDTO;
import com.iagami.employee.dto.ReturnTodayDataDTO1;
import com.iagami.employee.dto.TeamLeadAcceptanceDTO;
import com.iagami.employee.dto.TimesheetDTO;
import com.iagami.employee.dto.TimesheetDeleteDTO;
import com.iagami.employee.dto.UserDeatilsSignUp;
import com.iagami.employee.dto.UserDetailsDto;
import com.iagami.employee.entity.EmployeeDetails;

public interface Service_Interface {

	List<EmployeeDetailDTO> getEmployeedata(int employeeId) ;

	List<CompanyDTO> getCompany();

	List<EntityProjectsDTO> getProjects(Integer company_id);

	

	boolean savetimesheetadd(TimesheetDTO timesheetdto);

	//boolean flagchange(TimesheetDTO timesheetdto);

	List<Integer> getTeamLeadList(Integer id);
	List<ReturnTodayDataDTO> gettodayData(Integer userId);

	

	Object alldata(String emailId);

	boolean userDetailsServiceExistId(String emailId);

	String UserDeatilsServicePasswordCheck(String emailId);

	String insertIntoDb(UserDeatilsSignUp userDeatilsSignUp);

	UserDetailsDto getUpdateDate(LoginDto loginDto);

	boolean userServiceGetEmployeecode(String employeeCode);

	boolean employeeIdExist(String employeeCode);

	boolean employeeMailCheckEmployeeTable(String emailId);


	List<ReturnTodayDataDTO1> getTeamWorkDetails(Integer userId);

	boolean generateExcelService(List<Integer>ids,int month,int year,String excelFile);

	Optional<EmployeeDetails> finbById(Integer id);

	boolean auditTableSave(List<TeamLeadAcceptanceDTO> teamLeadAcceptance);
	
	List<Integer> getTeamLeadEmployeeList(List<Integer> id);
	List<MonthDataDuration> getTeamLeadtask(List<Integer> leadsId );
	List<List<MonthDataDuration>> getTeamMember(List<Integer> userIds) ;
	public List<MonthlyDataDTO> getAllData(MonthExcelDTO monthDataDto);
	
	public List<MonthDataDuration>  extractData(List<MonthlyDataDTO> monthdata, Integer user_id);
	
	public List<MonthDataDuration> getTeamLeadtaskfinal(List<Integer> leadsId);
	
	public List<HistoryDto> getModifyHistory(DateFormatDto dateformat);
	boolean verifyValidEmail(LoginDto loginRequest);

	boolean generateExcelProductionHour(Integer id, Integer month, Integer year, String fileName);

	boolean generateExcelProjectWiseEmployee(Integer id, Integer month, Integer year, String fileName);

	List<Map<String, Object>> getScreensByEmployeeEmail(String username);
	public List<MonthDataDuration>  extractDataAll(List<MonthlyDataDTO> monthdata,List<Integer> id);
	List<Map<String, Object>> getUserDetails(String username);
	public List<MonthlyDataDTO> getAllDataAll(MonthExcelDTO monthDataDto);
	DashboardDto dashboardgetdata(List<Integer> monthList);
	public  List<Integer> getAllDataTeamlead(Integer id);
	boolean auditTableSaveReject(TeamLeadAcceptanceDTO teamLeadAcceptance);
	public DashboardDto dashboardgetdata(Integer months);
	String uploadExcelRead(MultipartFile excelfile)throws ParseException;

	String deleteWorkId(TimesheetDeleteDTO timesheetDeleteDTO);

	List<EntityProjectsDTO> getProjectForExcel(Integer employeeId);
}
