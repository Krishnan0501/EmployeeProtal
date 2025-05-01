package com.iagami.employee.service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.apache.poi.common.usermodel.HyperlinkType;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Hyperlink;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.internal.build.AllowSysOut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.iagami.employee.dto.*;
import com.iagami.employee.dto.CompanyDTO;
import com.iagami.employee.dto.DashboardDto;
import com.iagami.employee.dto.EmpIdCode;
import com.iagami.employee.dto.EmployeeDetailDTO;
import com.iagami.employee.dto.EmployeeUserDetailsDto;
import com.iagami.employee.dto.EmployeeWorkDetailsDTO;
import com.iagami.employee.dto.EntityProjectsDTO;
import com.iagami.employee.dto.LoginDto;
import com.iagami.employee.dto.MonthDataDuration;
import com.iagami.employee.dto.MonthExcelDTO;
import com.iagami.employee.dto.MonthlyDataDTO;
import com.iagami.employee.dto.ReturnTodayDataDTO;
import com.iagami.employee.dto.ReturnTodayDataDTO1;
import com.iagami.employee.dto.ShowTodayDTO;
import com.iagami.employee.dto.TeamLeadAcceptanceDTO;
import com.iagami.employee.dto.TimesheetDTO;
import com.iagami.employee.dto.TimesheetDeleteDTO;
import com.iagami.employee.dto.UserDeatilsSignUp;
import com.iagami.employee.dto.UserDetailsDto;
import com.iagami.employee.entity.AuditTable;
import com.iagami.employee.entity.Company;
import com.iagami.employee.entity.EmployeeDetails;
import com.iagami.employee.entity.Employee_work;
import com.iagami.employee.entity.FingerprintData;
import com.iagami.employee.entity.Project;
import com.iagami.employee.entity.ReportingManager;
import com.iagami.employee.entity.Status;
import com.iagami.employee.entity.UserDetailsEntity;
import com.iagami.employee.repository.AuditTable_Repository;
import com.iagami.employee.repository.Company_Repository;
import com.iagami.employee.repository.DomainRepository;
import com.iagami.employee.repository.EmployeeDetails_Repository;
import com.iagami.employee.repository.EmployeeWork_Repository;
import com.iagami.employee.repository.FingerprintDataRepository;
import com.iagami.employee.repository.Project_Repository;
import com.iagami.employee.repository.Reporting_ManagerRepository;
import com.iagami.employee.repository.RoleScreenMapRepository;
import com.iagami.employee.repository.ScreenRespository;
import com.iagami.employee.repository.Status_Repository;
import com.iagami.employee.repository.TeamLeadProjectMap;
import com.iagami.employee.repository.UserDeatsils_Repository;
import com.iagami.employee.serviceInterface.Service_Interface;

import jakarta.transaction.Transactional;

@Service
public class Service_Implementation implements Service_Interface{
	private static final Logger log = LoggerFactory.getLogger(Service_Interface.class);
	@Autowired
	private  EmployeeDetails_Repository employeeDetails_Repository;
	@Autowired
	private  Company_Repository company_Repository;
	@Autowired
	private  Project_Repository project_Repository;

	@Autowired
	private  EmployeeWork_Repository employeework_Repository;
	@Autowired
	private  UserDeatsils_Repository userDeatsils_Repository;
	@Autowired
	private  Reporting_ManagerRepository reporting_ManagerRepository;
	@Autowired
	private Status_Repository status_Repository;
	@Autowired
	private AuditTable_Repository auditTable_Repository;
	@Autowired
	private DomainRepository domainRepository;
	@Autowired
	private RoleScreenMapRepository roleScreenMapRepository;
	@Autowired
	private ScreenRespository screenRespository ;
	@Autowired
	private FingerprintDataRepository fingerprintDataRepository;
	@Autowired
	private TeamLeadProjectMap teamLeadProjectMap;



	@Override
	@Transactional
	public List<EmployeeDetailDTO> getEmployeedata(int employeeId) {
		Optional<EmployeeDetails> isManager = employeeDetails_Repository.findById(employeeId);
		System.out.println("isMa: " + isManager);

		if (isManager.isEmpty()) {
			return Collections.emptyList();
		}

		EmployeeDetails manager = isManager.get();
		int managerRole = manager.getRoleId();
		System.out.println("Role ID: " + managerRole);

		// If Manager (roleId == 3)
		if (managerRole == 3) {
			List<EmployeeDetails> employees = employeeDetails_Repository.fetchEmployeeData();

			return employees.stream().map(this::mapToDTO).collect(Collectors.toList());
		} else {
			// For other roles (e.g., roleId == 2), fetch only their team members
			List<EmployeeDetails> teamMembers = employeeDetails_Repository.getTeamMembers(employeeId);

			if (teamMembers.isEmpty()) {
				log.info("No team members found for Employee ID: " + employeeId);
				return Collections.emptyList();
			}

			return teamMembers.stream().map(this::mapToDTO).collect(Collectors.toList());
		}
	}
	private EmployeeDetailDTO mapToDTO(EmployeeDetails e) {
		EmployeeDetailDTO dto = new EmployeeDetailDTO();
		dto.setEmployeeId(e.getEmployeeId());
		dto.setEmployeeCode(e.getEmployeeCode());
		dto.setFirstName(e.getEmployeeFirstName());
		dto.setLastName(e.getEmployeeLastName());
		dto.setEmail(e.getEmployeeEmail());
		dto.setMobileNumber(e.getEmployeeContactNumber());

		if (e.getEmployeeReportingManager() != null) {
			reporting_ManagerRepository.findById(e.getEmployeeReportingManager())
				.ifPresentOrElse(
					manager -> dto.setReportingManager(manager.getReportingManagerName()),
					() -> dto.setReportingManager("N/A")
				);
		} else {
			dto.setReportingManager("N/A");
		}

		return dto;
	}




	@Override
	@Transactional
	public List<CompanyDTO> getCompany() {
		try {
			log.info("Fetching all companies from the database...");

			List<Company> ListcompanyEntity = company_Repository.findAll();

			if (ListcompanyEntity.isEmpty()) {
				log.warn("No company records found.");
				return Collections.emptyList();
			}
			List<CompanyDTO> listcomany=new ArrayList<>();
			for(Company company:ListcompanyEntity) {
				CompanyDTO companydto=new CompanyDTO();
				companydto.setEntityCode(company.getEntityCode());
				companydto.setEntityId(company.getEntityId());
				listcomany.add(companydto);
			}
			return listcomany;

		} catch (Exception e) {
			log.error("Error fetching companies", e);
			return Collections.emptyList();
		}
	}


	@Override
	@Transactional
	public List<EntityProjectsDTO> getProjects(Integer company_id) {
		try {
			log.info("Fetching projects for company_id: {}", company_id);
			List<Project> projects = project_Repository.getProjectsofCompany(company_id);

			if (projects.isEmpty()) {
				log.warn("No projects found for company_id: {}", company_id);
				return Collections.emptyList();
			}

			// ✅ Map Project entities to DTOs manually
			return projects.stream().map(p -> {
				EntityProjectsDTO dto = new EntityProjectsDTO();
				dto.setProjectId(p.getProjectId());
				dto.setProjectCode(p.getProjectCode());
				dto.setClientName(p.getClientName());
				return dto;
			}).collect(Collectors.toList());

		} catch (Exception e) {
			log.error("Error fetching projects for company_id: {}", company_id, e);
			return Collections.emptyList();
		}
	}



	@Override
	@Transactional
	public boolean savetimesheetadd(TimesheetDTO timesheetdto) {
		try {
			log.info("Checking if timesheet data already exists before saving. UserID: {}", timesheetdto.getUserId());

			// Basic validation checks
			if (timesheetdto.getUserId() == null || timesheetdto.getEntityId() == null
					|| timesheetdto.getProjectId() == null || timesheetdto.getClientName() == null
					|| timesheetdto.getDuration() <= 0 || timesheetdto.getTaskStatus() == null
					|| timesheetdto.getDescription() == null || timesheetdto.getStatusCode() == null
					|| timesheetdto.getDescription().trim().isEmpty() || timesheetdto.getStatusCode().trim().isEmpty()) {
				return false;
			}

			Integer userId = timesheetdto.getUserId();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			String dateOnlyStr = sdf.format(new Date());
			Date dateOnly = sdf.parse(dateOnlyStr);

			// Check for existing timesheet entries for today
			Optional<List<Employee_work>> existingData = employeework_Repository.getTodayDataPrimary(userId, dateOnly);
			log.info("Existing timesheet entries: {}", existingData.orElse(Collections.emptyList()));

			// Get employee info
			Optional<EmployeeDetails> employeeEntity = employeeDetails_Repository.findById(userId);
			if (!employeeEntity.isPresent()) {
				log.error("Employee details not found for UserID: {}", userId);
				return false;
			}

			// Validate status code
			Status statusEntity = status_Repository.retrieveStatusDetails(timesheetdto.getStatusCode());
			if (statusEntity == null) {
				log.error("Invalid status code provided: {}", timesheetdto.getStatusCode());
				return false;
			}
			log.info("Status entity retrieved: {} -> {}", timesheetdto.getStatusCode(), statusEntity.getStatusId());

			// Initialize common fields
			CommonDataDTO commomdatadto = new CommonDataDTO();
			commomdatadto.setDate(dateOnly);
			commomdatadto.setDeleteFlag(0);

			Employee_work savedWorkEntry = null;

			// UPDATE case
			if (timesheetdto.getWorkId() != null) {
				Employee_work existingEmployeeWork = employeework_Repository.findById(timesheetdto.getWorkId()).orElse(null);
				if (existingEmployeeWork != null) {
					existingEmployeeWork.setEntityId(timesheetdto.getEntityId());
					existingEmployeeWork.setProjectId(timesheetdto.getProjectId());
					existingEmployeeWork.setClientName(timesheetdto.getClientName());
					existingEmployeeWork.setDescription(timesheetdto.getDescription());
					existingEmployeeWork.setDuration(timesheetdto.getDuration());
					existingEmployeeWork.setStatusId(statusEntity.getStatusId());
					existingEmployeeWork.setTaskStatus(timesheetdto.getTaskStatus());
					existingEmployeeWork.setModifyBy(employeeEntity.get().getEmployeeFirstName());
					existingEmployeeWork.setModifyByTimestamp(new Timestamp(System.currentTimeMillis()));

					savedWorkEntry = employeework_Repository.save(existingEmployeeWork);
					log.info("Existing timesheet entry updated successfully.");
				} else {
					log.warn("No timesheet entry found with the provided WorkId.");
					return false;
				}
			}
			// CREATE case
			else {
				Employee_work employeework = new Employee_work();
				employeework.setEmployeeId(userId);
				employeework.setDate(commomdatadto.getDate());
				employeework.setEntityId(timesheetdto.getEntityId());
				employeework.setProjectId(timesheetdto.getProjectId());
				employeework.setClientName(timesheetdto.getClientName());
				employeework.setDescription(timesheetdto.getDescription());
				employeework.setDuration(timesheetdto.getDuration());
				employeework.setStatusId(statusEntity.getStatusId());
				employeework.setDeleteFlag(commomdatadto.getDeleteFlag());
				employeework.setCreatedBy(employeeEntity.get().getEmployeeFirstName());
				employeework.setModifyBy(employeeEntity.get().getEmployeeFirstName());
				employeework.setTaskStatus(timesheetdto.getTaskStatus());
				employeework.setReMarks(null);

				// Check for duplicates
				if (existingData.isPresent() && !existingData.get().isEmpty()) {
					log.info("Checking for duplicate timesheet entry...");

					LocalDate newEntryDate = LocalDate.ofInstant(employeework.getDate().toInstant(), ZoneId.systemDefault());
					String newEntryKey = newEntryDate + "|" + employeework.getEntityId() + "|" +
							employeework.getProjectId() + "|" + employeework.getClientName() + "|" +
							employeework.getDescription().trim() + "|" + employeework.getDuration() + "|" +
							employeework.getTaskStatus();

					Set<String> existingSet = existingData.get().stream()
							.map(existing -> existing.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate() + "|" +
									existing.getEntityId() + "|" + existing.getProjectId() + "|" +
									existing.getClientName() + "|" + existing.getDescription().trim() + "|" +
									existing.getDuration() + "|" + existing.getTaskStatus())
							.collect(Collectors.toSet());

					log.info("New Entry Key: {}", newEntryKey);
					log.info("Existing Entry Keys: {}", existingSet);

					if (existingSet.contains(newEntryKey)) {
						log.warn("Duplicate entry found! Skipping save.");
						return false;
					}
				}

				// Save new entry
				savedWorkEntry = employeework_Repository.save(employeework);
				log.info("New timesheet entry saved successfully.");
			}

			// Save Audit Entry for both create & update
			if (savedWorkEntry != null) {
				AuditTable audittable = new AuditTable();
				audittable.setEmployeeWorkId(savedWorkEntry.getId());
				Status status = status_Repository.findCode(timesheetdto.getStatusCode());
				audittable.setStatus(status.getStatusName());
				audittable.setCreatedBy(employeeEntity.get().getEmployeeFirstName());
				audittable.setCreatedByTimeStamp(new Timestamp(System.currentTimeMillis()));
				audittable.setRemark(null);
				auditTable_Repository.save(audittable);
				log.info("Audit record saved successfully.");
			}

			return true;
		} catch (Exception e) {
			log.error("Error saving timesheet", e);
			return false;
		}
	}

	@Override
	@Transactional
	public List<ReturnTodayDataDTO> gettodayData(Integer userId) {
		log.info("Retrieving today's timesheet data for user ID: {}", userId);
		List<ReturnTodayDataDTO> dtoList = new ArrayList<>();

		try {
			List<Object[]> results;
			ShowTodayDTO showTodayDTO = new ShowTodayDTO();
			showTodayDTO.setDate(new Date());
			Date date = showTodayDTO.getDate();
			java.sql.Date sqlDate = new java.sql.Date(date.getTime()); 


			results = employeework_Repository.getTodayData(userId, sqlDate);
			for (Object[] row : results) {
				ReturnTodayDataDTO returnTodayDataDTO = new ReturnTodayDataDTO();
				returnTodayDataDTO.setId(((Integer) row[0]).intValue());	        
				returnTodayDataDTO.setEmployeeId((Integer) row[1]);
				returnTodayDataDTO.setEntityName((String) row[2]);
				returnTodayDataDTO.setProjectName((String) row[3]);
				returnTodayDataDTO.setClientName((String) row[4]);
				returnTodayDataDTO.setDescription((String) row[5]);
				returnTodayDataDTO.setDuration(row[6] != null ? ((Number) row[6]).floatValue() : null);
				returnTodayDataDTO.setTaskStatusName((String) row[7]);
				returnTodayDataDTO.setStatusName((String)row[8]);
				returnTodayDataDTO.setRemarks((String)row[9]);
				returnTodayDataDTO.setEntityId((Integer)row[10]);
				returnTodayDataDTO.setProjectId((Integer)row[11]);

				dtoList.add(returnTodayDataDTO);
			}
		} catch (Exception e) {
			log.error("Error retrieving timesheet", e);
		}

		return dtoList;
	}


	

	@Override
	@Transactional
	public List<ReturnTodayDataDTO1> getTeamWorkDetails(Integer userId) {
		log.info("Fetching team members for Employee ID: {}", userId);

		List<ReturnTodayDataDTO1> dtoList = new ArrayList<>();

		try {
			List<String> teamMemberCodes = employeeDetails_Repository.getTeamMembersExcel(userId);

			if (teamMemberCodes.isEmpty()) {
				log.warn("No team members found for Employee ID: {}", userId);
				return dtoList;
			}

			log.info("Found {} team members for Employee ID: {}", teamMemberCodes.size(), userId);
			List<Status> listStatus = status_Repository.getStatuscode();
			Optional<Status> statusId = listStatus.stream()
					.filter(status -> "SUBMIT".equals(status.getStatusName()))
					.findFirst();

			Integer statusIdValue = statusId.map(Status::getStatusId).orElse(null);

			if (statusIdValue == null) {
				log.warn("'SUBMIT' status not found, returning empty list.");
				return dtoList;
			}

			List<Object[]> rawData = employeework_Repository.getTeamMembersTodayData(teamMemberCodes, statusIdValue);

			if (rawData.isEmpty()) {
				log.warn("No work details found for Employee ID: {}", userId);
				return dtoList;
			}

			for (Object[] row : rawData) {
				try {
					ReturnTodayDataDTO1 dto = new ReturnTodayDataDTO1();
					dto.setId(((Integer) row[0]).intValue());	        
					dto.setEmployeeId((Integer) row[1]);
					dto.setEntityName((String) row[2]);
					dto.setProjectName((String) row[3]);
					dto.setClientName((String) row[4]);
					dto.setDescription((String) row[5]);
					dto.setDuration(row[6] != null ? ((Number) row[6]).floatValue() : null);
					dto.setTaskStatusName((String) row[7]);
					dto.setStatusName((String)row[8]);
					dto.setRemarks((String)row[9]);

					dtoList.add(dto); 
				} catch (Exception e) {
					log.error("Error processing row: {}", Arrays.toString(row), e);
				}
			}
		} catch (Exception e) {
			log.error("Unexpected error in getTeamWorkDetails for Employee ID: {}", userId, e);
		}

		return dtoList; 
	}
	@Override
	@Transactional
	public Optional<EmployeeDetails> finbById(Integer id){
		return employeeDetails_Repository.findById(id);

	}



	@Value("${employee.excel.filepath}")
	private String excelFilePath;
	public Path getExcelFilePath() {
		return Paths.get(excelFilePath);
	}

	@Override
	@Transactional
	public boolean generateExcelService(List<Integer> employeeIds, int month, int year, String excelFile) {
		Path path = Paths.get(excelFilePath, excelFile);
		XSSFWorkbook workbook = new XSSFWorkbook();
		FileOutputStream fos = null;

		try {
			fos = new FileOutputStream(path.toFile());

			for (Integer id : employeeIds) {
				Optional<EmployeeDetails> employeeOpt = employeeDetails_Repository.findById(id);
				if (employeeOpt.isEmpty()) continue;

				String code = employeeOpt.get().getEmployeeCode();
				XSSFSheet sheet = workbook.createSheet(code);
				sheet.createFreezePane(1, 1);

				// Define header styles
				Font headerFont = workbook.createFont();
				headerFont.setBold(true);
				headerFont.setFontHeightInPoints((short) 14);

				CellStyle headerStyle = workbook.createCellStyle();
				headerStyle.setFont(headerFont);
				headerStyle.setAlignment(HorizontalAlignment.CENTER);
				headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
				headerStyle.setBorderTop(BorderStyle.THIN);
				headerStyle.setBorderBottom(BorderStyle.THIN);
				headerStyle.setBorderLeft(BorderStyle.THIN);
				headerStyle.setBorderRight(BorderStyle.THIN);

				CellStyle wrapTextStyle = workbook.createCellStyle();
				wrapTextStyle.setWrapText(true);
				wrapTextStyle.setVerticalAlignment(VerticalAlignment.TOP);
				wrapTextStyle.setBorderTop(BorderStyle.THIN);
				wrapTextStyle.setBorderBottom(BorderStyle.THIN);
				wrapTextStyle.setBorderLeft(BorderStyle.THIN);
				wrapTextStyle.setBorderRight(BorderStyle.THIN);

				CellStyle noWrapStyle = workbook.createCellStyle();
				noWrapStyle.setWrapText(false);
				noWrapStyle.setAlignment(HorizontalAlignment.CENTER);
				noWrapStyle.setVerticalAlignment(VerticalAlignment.CENTER);
				noWrapStyle.setBorderTop(BorderStyle.THIN);
				noWrapStyle.setBorderBottom(BorderStyle.THIN);
				noWrapStyle.setBorderLeft(BorderStyle.THIN);
				noWrapStyle.setBorderRight(BorderStyle.THIN);

				// Headers
				Row headerRow = sheet.createRow(0);
				String[] headers = {"Date", "Entity Name", "Project Name", "Client Name", "Description", "Duration", "Status", "Task Status", "Remark", "Total Hours"};

				for (int i = 0; i < headers.length; i++) {
					Cell cell = headerRow.createCell(i);
					cell.setCellValue(headers[i]);
					cell.setCellStyle(headerStyle);
				}

				// Fetch data
				Optional<List<Object[]>> listofData = employeework_Repository.getEmployeeData(id, month, year);
				if (listofData.isPresent() && !listofData.get().isEmpty()) {
					int rowNum = 1;
					int mergeStart = 1;
					String previousDate = null;
					double totalHours = 0;
					int totalHoursRowStart = 1;

					for (Object[] data : listofData.get()) {
						Row row = sheet.createRow(rowNum);
						String currentDate = data[0].toString();

						if (previousDate != null && !currentDate.equals(previousDate)) {
							if (mergeStart < rowNum - 1) {
								sheet.addMergedRegion(new CellRangeAddress(mergeStart, rowNum - 1, 0, 0));
								sheet.addMergedRegion(new CellRangeAddress(mergeStart, rowNum - 1, 9, 9));
							}
							Row totalHoursRow = sheet.getRow(totalHoursRowStart);
							if (totalHoursRow != null) {
								Cell totalHoursCell = totalHoursRow.createCell(9);
								totalHoursCell.setCellValue(formatNumber(totalHours));
								totalHoursCell.setCellStyle(noWrapStyle);
							}
							totalHours = 0;
							mergeStart = rowNum;
							totalHoursRowStart = rowNum;
						}

						for (int i = 0; i < headers.length; i++) {
							Cell cell = row.createCell(i);
							cell.setCellStyle(wrapTextStyle);
						}

						row.getCell(0).setCellValue(currentDate);
						row.getCell(0).setCellStyle(noWrapStyle);
						row.getCell(1).setCellValue((String) data[1]);
						row.getCell(2).setCellValue((String) data[2]);
						row.getCell(3).setCellValue((String) data[3]);

						String description = (String) data[4];
						row.getCell(4).setCellValue(description);
						int lineCount = (int) Math.ceil(description.length() / 30.0);
						row.setHeightInPoints((lineCount + 1) * sheet.getDefaultRowHeightInPoints());

						double duration = 0;
						if (data[5] instanceof Number) {
							duration = ((Number) data[5]).doubleValue();
							row.getCell(5).setCellValue(formatNumber(duration));
						}
						totalHours += duration;

						row.getCell(6).setCellValue((String) data[6]);
						row.getCell(7).setCellValue((String) data[7]);
						row.getCell(8).setCellValue((String) data[8]);

						previousDate = currentDate;
						rowNum++;
					}

					if (mergeStart < rowNum - 1) {
						sheet.addMergedRegion(new CellRangeAddress(mergeStart, rowNum - 1, 0, 0));
						sheet.addMergedRegion(new CellRangeAddress(mergeStart, rowNum - 1, 9, 9));
					}

					Row totalHoursRow = sheet.getRow(totalHoursRowStart);
					if (totalHoursRow != null) {
						Cell totalHoursCell = totalHoursRow.createCell(9);
						totalHoursCell.setCellValue(formatNumber(totalHours));
						totalHoursCell.setCellStyle(noWrapStyle);
					}

					sheet.setColumnWidth(4, 10000);
					for (int i = 0; i < headers.length; i++) {
						if (i != 4) sheet.autoSizeColumn(i);
					}
				}
			}

			workbook.write(fos);
			log.info("Multi-employee Excel file generated successfully at: {}", path);
			return true;

		} catch (Exception e) {
			log.error("Error generating multi-sheet Excel: ", e);
			return false;
		} finally {
			try {
				if (fos != null) fos.close();
				if (workbook != null) workbook.close();
			} catch (IOException e) {
				log.error("Error closing resources: ", e);
			}
		}
	}



	private String formatNumber(double value) {
		if (value == (long) value) {
			return String.valueOf((long) value);  // Remove decimal if it's zero
		} else {
			return String.format("%.2f", value); // Keep two decimal places if needed
		}
	}


	@Override
	@Transactional
	public boolean auditTableSave(List<TeamLeadAcceptanceDTO> teamLeadAcceptanceList) {
		try {
			if (teamLeadAcceptanceList == null || teamLeadAcceptanceList.isEmpty()) {
				log.warn("Validation failed: teamLeadAcceptanceList is empty.");
				return false;
			}

			List<AuditTable> auditTableList = new ArrayList<>();
			List<Integer> workIdsToUpdate = new ArrayList<>();

			for (TeamLeadAcceptanceDTO dto : teamLeadAcceptanceList) {
				log.info("Processing WorkID: {}", dto.getWorkId());

				if (dto.getWorkId() == null || dto.getUserId() == null || dto.getStatusCode() == null) {
					log.warn("Validation failed: Fields missing for WorkID: {}, UserID: {}, StatusCode: {}",
							dto.getWorkId(), dto.getUserId(), dto.getStatusCode());
					return false;
				}

				Status status = status_Repository.findCode(dto.getStatusCode());
				if (status == null) {
					log.error("Status not found for StatusCode: {}", dto.getStatusCode());
					return false;
				}

				String employee = employeeDetails_Repository.findManagerNameByEmployeeId(dto.getUserId());
				if (employee == null) {
					log.error("Employee details not found for UserID: {}", dto.getUserId());
					return false;
				}

				AuditTable audit = new AuditTable();
				audit.setEmployeeWorkId(dto.getWorkId());
				audit.setRemark(dto.getRemark()); // Can be null or value depending on ACCEPT / REJECT
				audit.setStatus(status.getStatusName());
				audit.setCreatedBy(employee);
				audit.setCreatedByTimeStamp(new Timestamp(System.currentTimeMillis()));

				auditTableList.add(audit);

				// Update work status inline
				log.info("Updating WorkID: {} with StatusID: {}, Modifier: {}, Remark: {}",
						dto.getWorkId(), status.getStatusId(), employee, dto.getRemark());

				employeework_Repository.updateDataFromTL(dto.getWorkId(),status.getStatusId(),employee,dto.getRemark());
			}

			// Save all audit records in a single batch operation
			auditTable_Repository.saveAll(auditTableList);

			log.info("All audit records saved successfully.");
			return true;

		} catch (Exception e) {
			log.error("Exception in auditTableSave(List<TeamLeadAcceptanceDTO>)", e);
			return false;
		}
	}


	@Override
	@Transactional
	public boolean auditTableSaveReject(TeamLeadAcceptanceDTO teamLeadAcceptance) {
		try {
			log.info("Starting auditTableSave process for WorkID: {}", teamLeadAcceptance.getWorkId());
			if (teamLeadAcceptance.getWorkId() == null || teamLeadAcceptance.getUserId() == null
					|| teamLeadAcceptance.getStatusCode() == null || teamLeadAcceptance.getRemark() == null) {
				log.warn("Validation failed: Some required fields are null. WorkID: {}, UserID: {}, StatusCode: {}, Remark: {}",
						teamLeadAcceptance.getWorkId(), teamLeadAcceptance.getUserId(), 
						teamLeadAcceptance.getStatusCode(), teamLeadAcceptance.getRemark());
				return false;
			}

			log.info("Fetching status details for StatusCode: {}", teamLeadAcceptance.getStatusCode());
			Status status = status_Repository.findCode(teamLeadAcceptance.getStatusCode());
			if (status == null) {
				log.error("Status not found for StatusCode: {}", teamLeadAcceptance.getStatusCode());
				return false;
			}

			log.info("Fetching employee details for UserID: {}", teamLeadAcceptance.getUserId());
			String employeedetails = employeeDetails_Repository.findManagerNameByEmployeeId(teamLeadAcceptance.getUserId());
			if (employeedetails == null) {
				log.error("Employee details not found for UserID: {}", teamLeadAcceptance.getUserId());
				return false;
			}

			AuditTable auditTable = new AuditTable();
			auditTable.setEmployeeWorkId(teamLeadAcceptance.getWorkId());
			auditTable.setRemark(teamLeadAcceptance.getRemark());
			auditTable.setStatus(status.getStatusName());
			auditTable.setCreatedBy(employeedetails);
			auditTable.setCreatedByTimeStamp(new Timestamp(System.currentTimeMillis()));

			log.info("Saving audit record: {}", auditTable);
			auditTable_Repository.save(auditTable);

			log.info("Updating Employee Work entry for WorkID: {} with StatusID: {}, ModifyBy: {}, Remark: {}",
					teamLeadAcceptance.getWorkId(), status.getStatusId(), employeedetails,
					teamLeadAcceptance.getRemark());

			employeework_Repository.updateDataFromTL(teamLeadAcceptance.getWorkId(), status.getStatusId(),
					employeedetails, teamLeadAcceptance.getRemark());

			log.info("auditTableSave process completed successfully for WorkID: {}", teamLeadAcceptance.getWorkId());
			return true;

		} catch (Exception e) {
			log.error("Error while saving audit data for WorkID: {}", teamLeadAcceptance.getWorkId(), e);
			return false;
		}
	}



	@Override
	@Transactional
	public String UserDeatilsServicePasswordCheck(String email) {
		log.info("----- UserService UserDeatilsServicePasswordCheck Start--------");
		try {
			String password=userDeatsils_Repository.getpassword(email);
			return password;
		}catch (Exception e) {
			log.error("Error"+e.getMessage());
			return null;
		}finally {
			log.info("-------------UserService UserDeatilsServicePasswordCheck End----------");
		}
	}
	@Override
	@Transactional
	public boolean userDetailsServiceExistId(String userId) {
		log.info("----- UserService: userDetailsServiceExistId Start -----");

		try {
			Optional<UserDetailsEntity> optionalUserDetails = userDeatsils_Repository.findemailid(userId);
			boolean doesNotExist = optionalUserDetails.isEmpty();
			return doesNotExist;
		} catch (Exception e) {
			log.error("Error in userDetailsServiceExistId: {}", e.getMessage(), e);
			return false;
		} finally {
			log.info("----- UserService: userDetailsServiceExistId End  -----");
		}
	}


	@Transactional
	public Boolean userDetailsInEmployeeTableServiceExistid(String mailId) {
		log.info("----- UserService userDetailsInEmployeeTableServiceExistid Start --------");

		try {
			Optional<EmployeeDetails> optionalUserDetailsEntity = employeeDetails_Repository.findemailId(mailId);
			return optionalUserDetailsEntity.isEmpty();
		} catch (Exception e) {
			log.error("Error: " + e.getMessage());
			return null;
		} finally {
			log.info("------------- UserService userDetailsInEmployeeTableServiceExistid End ----------");
		}
	}
	@Override
	@Transactional
	public UserDetailsDto alldata(String emailId) {
		log.info("----- UserService alldata Start --------");

		try {
			UserDetailsDto userDetailsDto = new UserDetailsDto(userDeatsils_Repository.logindata(emailId).get());
			userDetailsDto.setPassword(decodeuserpassword(userDetailsDto.getPassword()));
			return userDetailsDto;
		} catch (Exception e) {
			log.error("Error: " + e.getMessage());
			return null;
		} finally {
			log.info("------------- UserService alldata End ----------");
		}
	}

	public static String decodeuserpassword(String encodedPassword) {
		byte[] decodedBytes = Base64.getDecoder().decode(encodedPassword);
		return new String(decodedBytes);
	}
	@Override
	@Transactional
	public String insertIntoDb(UserDeatilsSignUp userDeatilsSignUp) {
		log.info("----- UserService insertIntoDb Start --------");

		try {
			EmployeeDetails employeeDetails = employeeDetails_Repository.findByEmployeeCode(userDeatilsSignUp.getEmployeeCode());

			UserDetailsEntity userDetails = new UserDetailsEntity();
			userDetails.setChangedPasswordDate(LocalDateTime.now());
			userDetails.setEmailId(userDeatilsSignUp.getEmailId());
			userDetails.setEmployee(employeeDetails);
			userDetails.setFirstLogin(true);
			userDetails.setPassword(userDeatilsSignUp.getPassword());
			userDetails.setEntity_Id(employeeDetails.getCompany_id());

			userDeatsils_Repository.save(userDetails);
			log.info("UserDetails inserted successfully");
			return "Success";
		} catch (Exception e) {
			log.error("Error while inserting UserDetails: {}", e.getMessage());
			return "Failed";
		} finally {
			log.info("------------- UserService insertIntoDb End ----------");
		}
	}
	@Override
	@Transactional
	public boolean userServiceGetEmployeecode(String code) {
		log.info("----- userServiceGetEmployeecode Start --------");
		try {
			Optional<UserDetailsEntity> password = userDeatsils_Repository.findByEmployeeCode(code);
			boolean exists = password.isPresent();
			return exists;
		} catch (Exception e) {
			log.error("Error in userServiceGetEmployeecode: {}", e.getMessage());
			return false;
		} finally {
			log.info("------------- userServiceGetEmployeecode End ----------");
		}
	}
	@Override
	@Transactional
	public boolean employeeIdExist(String code) {
		log.info("----- employeeIdExist Start --------");
		try {
			EmployeeDetails employeeDetails = employeeDetails_Repository.findByEmployeeCode(code);
			boolean doesNotExist = (employeeDetails == null);
			return doesNotExist;
		} catch (Exception e) {
			log.error("Error in employeeIdExist: {}", e.getMessage());
			return true;
		} finally {
			log.info("------------- employeeIdExist End ----------");
		}
	}
	@Override
	@Transactional
	public boolean employeeMailCheckEmployeeTable(String email) {
		log.info("----- employeeMailCheckEmployeeTable Start --------");
		try {
			EmployeeDetails employeeDetails = employeeDetails_Repository.findByEmployeeMail(email);
			boolean doesNotExist = (employeeDetails == null);
			return doesNotExist;
		} catch (Exception e) {
			log.error("Error in employeeMailCheckEmployeeTable: {}", e.getMessage());
			return true;
		} finally {
			log.info("------------- employeeMailCheckEmployeeTable End ----------");
		}
	}
	@Override
	@Transactional
	public UserDetailsDto getUpdateDate(LoginDto loginDto) {
		try {
			userDeatsils_Repository.updatePasswordByEmail(loginDto.getEmailId(), loginDto.getPassword());
			Optional<EmployeeUserDetailsDto> optionalUser = userDeatsils_Repository.logindata(loginDto.getEmailId());
			if (optionalUser.isPresent()) {
				optionalUser.get().setPassword(decodeuserpassword(optionalUser.get().getPassword()));
				return new UserDetailsDto(optionalUser.get());
			}
			return null;
		} catch (Exception e) {
			System.out.println(e.getMessage() + " error");
			return null;
		}
	}


	@Override
	@Transactional
	public List<Integer> getTeamLeadList(Integer id) {
		try {
			List<Integer> relatedTeamLead = employeework_Repository.getAllTeamLead(id);
			log.info("Retrieved team leads for ID {}: {}", id, relatedTeamLead);
			return relatedTeamLead;
		} catch (Exception e) {
			log.error("Error retrieving team leads for ID: {}", id, e);
			return Collections.emptyList();
		}
	}
	@Override
	@Transactional
	public List<Integer> getTeamLeadEmployeeList(List<Integer> ids) {
		try {
			List<Integer> relatedTeamLead = employeework_Repository.getAllTeamLeadEmployees(ids);
			System.out.println(relatedTeamLead);
			log.info("Retrieved team lead employees for IDs {}: {}", ids, relatedTeamLead);
			return relatedTeamLead;
		} catch (Exception e) {
			log.error("Error retrieving team lead employees for IDs {}: {}", ids, e.getMessage(), e);
			return Collections.emptyList();
		}
	}

	@Override
	@Transactional
	public List<MonthDataDuration> getTeamLeadtask(List<Integer> leadsId) {
		log.info("Retrieving today's timesheet data for team leads: {}", leadsId);
		List<MonthDataDuration> finalData = new ArrayList<>();
		Set<String> seen = new HashSet<>(); // To track unique combinations

		try {
			System.out.println("get team leasd task :" + leadsId);
			List<Object[]> results =new ArrayList<Object[]>();
			results.addAll(employeework_Repository.getEmployeeWorkDetail(leadsId));

			for (Object[] row : results) {

				Integer empId = (Integer) row[11];
				Date date = (Date) row[0];
				System.out.println(empId);
				String uniqueKey = empId + "_" + date.toString();
				if (seen.contains(uniqueKey)) {
					continue; 
				}
				seen.add(uniqueKey);

				MonthlyDataDTO dto = new MonthlyDataDTO(
						(Date) row[0],
						(String) row[1],
						(String) row[2],
						(String) row[3],
						(String) row[4],
						(Float) row[5],
						(String) row[6],
						(String) row[7],
						(String) row[8],
						(Integer) row[9],
						(String) row[10],
						(Integer) row[11]
						);

				MonthDataDuration monthlydata = new MonthDataDuration();
				monthlydata.setName(employeeDetails_Repository.findById(empId).get().getEmployeeFirstName());
				monthlydata.setDate(date);
				monthlydata.setDuration(employeework_Repository.durationOfEmployee(empId, date));
				monthlydata.setData(getEmployeeWorkDetails(empId, date));
				finalData.add(monthlydata);
			}
		} catch (Exception e) {
			log.error("Error retrieving timesheet for team leads: {}", leadsId, e);
		}

		return finalData;
	}

	@Override
	@Transactional
	public List<MonthDataDuration> getTeamLeadtaskfinal(List<Integer> leadsId) {
		log.info("Retrieving today's timesheet data for team leads: {}", leadsId);
		List<MonthDataDuration> finalData = new ArrayList<>();
		Set<String> seen = new HashSet<>(); // To track unique combinations

		try {
			System.out.println("get team leasd task :" + leadsId);
			List<Object[]> results =new ArrayList<Object[]>();
			results.addAll(employeework_Repository.getEmployeeWorkDetailMemeber(leadsId));

			for (Object[] row : results) {

				Integer empId = (Integer) row[11];
				Date date = (Date) row[0];
				System.out.println(empId);
				String uniqueKey = empId + "_" + date.toString();
				if (seen.contains(uniqueKey)) {
					continue; 
				}
				seen.add(uniqueKey);

				MonthlyDataDTO dto = new MonthlyDataDTO(
						(Date) row[0],
						(String) row[1],
						(String) row[2],
						(String) row[3],
						(String) row[4],
						(Float) row[5],
						(String) row[6],
						(String) row[7],
						(String) row[8],
						(Integer) row[9],
						(String) row[10],
						(Integer) row[11]
						);

				MonthDataDuration monthlydata = new MonthDataDuration();
				monthlydata.setName(employeeDetails_Repository.findById(empId).get().getEmployeeFirstName());
				monthlydata.setDate(date);
				monthlydata.setDuration(employeework_Repository.durationOfEmployeeMonthly(empId, date));
				monthlydata.setData(getEmployeeWorkDetailsMember(empId, date));
				finalData.add(monthlydata);
			}
		} catch (Exception e) {
			log.error("Error retrieving timesheet for team leads: {}", leadsId, e);
		}

		return finalData;
	}
	@Override
	@Transactional
	public List<List<MonthDataDuration>> getTeamMember(List<Integer> userIds) {
		log.info("Retrieving today's timesheet data for team members: {}", userIds);
		List<List<MonthDataDuration>> finalList = new ArrayList<>();

		try {
			if(!userIds.isEmpty()) {
				List<MonthlyDataDTO> dtoList = new ArrayList<>();
				List<Object[]> results = employeework_Repository.getEmployeeWorkDetail(userIds);
				System.out.println("getteammemnber :"+results);
				for (Object[] row : results) {
					dtoList.add(new MonthlyDataDTO(
							(Date)row[0],//Date
							(String) row[1],  // company name
							(String) row[2],   // project name
							(String) row[3],   // technologyname
							(String) row[4],   // descrption
							(Float) row[5],   // duration
							(String) row[6],  // statusname
							(String) row[7],   // task name
							(String) row[8] ,//remarks
							(Integer) row[9],//work id
							(String) row[10],
							(Integer) row[11]// TASK_NAME 
							));
					List<MonthDataDuration> duration= extractData(dtoList,(Integer) row[11]);
					if (!dtoList.isEmpty()) {
						finalList.add(duration);
						log.info("Successfully retrieved {} records for team members.", dtoList.size());
					}  
				}
			}else {
				return finalList;
			}


		} catch (Exception e) {
			log.error("Error retrieving timesheet for team members: {}", userIds, e);
		}

		return finalList;
	}
	@Override
	@Transactional
	public List<MonthDataDuration>  extractData(List<MonthlyDataDTO> monthdata, Integer user_id) {
		List<Date> dates= new ArrayList<Date>();

		for(MonthlyDataDTO m:monthdata) {
			dates.add((Date) m.getDate());
		}
		Set<Date> uniqueEmployeeNumbers = new HashSet<>(dates);
		List<Date> employeeIds = new ArrayList<>(uniqueEmployeeNumbers);
		List<MonthDataDuration> monthdatas=new ArrayList<MonthDataDuration>();
		for(Date d:employeeIds) {
			MonthDataDuration monthlydata=new MonthDataDuration();
			monthlydata.setName(employeeDetails_Repository.findById(user_id).get().getEmployeeFirstName());
			monthlydata.setDate(d);
			monthlydata.setDuration(employeework_Repository.durationOfEmployeeMonthly(user_id,d ));
			List<EmployeeWorkDetailsDTO> dateDataFromCustom=getEmployeeWorkDetailsMonthly(user_id,d );
			monthlydata.setData(dateDataFromCustom);
			monthdatas.add(monthlydata);
		}
		return  monthdatas;
	}

	@Override
	@Transactional
	public List<MonthlyDataDTO> getAllData(MonthExcelDTO monthDataDto) {
		List<MonthlyDataDTO> dtoList = new ArrayList<>();

		try {
			Optional<List<Object[]>> employeeData = employeework_Repository.getEmployeeData(
					monthDataDto.getEmployeeId(), 
					monthDataDto.getMonth(), 
					monthDataDto.getYear()
					);
			System.out.println("getting daat employee" +monthDataDto.getEmployeeId());
			if (employeeData.isPresent()) {
				dtoList = employeeData.get().stream()
						.map(row -> new MonthlyDataDTO(
								(Date) row[0],  // DATE
								(String) row[1], // ENTITY_NAME
								(String) row[2], // PROJECT_NAME
								(String) row[3], // TECHNOLOGY_NAME
								(String) row[4], // DESCRIPTION
								(Float) row[5],  
								(String) row[6], // STATUS
								(String) row[7], // TASK_STATUS
								(String) row[8],
								(Integer) row[9],
								(String) row[10],
								(Integer) row[11]// REMARK
								))
						.collect(Collectors.toList());

				log.info("Successfully retrieved {} records.", dtoList.size());
			} else {
				log.warn("No data found for user {} in month {} and year {}", 
						monthDataDto.getEmployeeId(), 
						monthDataDto.getMonth(), 
						monthDataDto.getYear());
			}
		} catch (Exception e) {
			log.error("Error retrieving timesheet for user {} in month {} and year {}", 
					monthDataDto.getEmployeeId(), 
					monthDataDto.getMonth(), 
					monthDataDto.getYear(), e);
		}

		return dtoList;
	}

	@Transactional
	public List<EmployeeWorkDetailsDTO> getEmployeeWorkDetailsMonthly(Integer id, Date date) {
		List<Object[]> results = employeework_Repository.getEmployeeWorkDetailsMonthly(id, date);
		List<EmployeeWorkDetailsDTO> dtoList = new ArrayList<>();

		for (Object[] row : results) {
			dtoList.add(new EmployeeWorkDetailsDTO(
					(Integer) row[0],  // EMPLOYEE_ID
					(String) row[1],   // COMPANY_NAME
					(String) row[2],   // PROJECT_NAME
					(String) row[3],   // TECHNOLOGY_NAME
					(String) row[4],   // DESCRIPTION
					(Float) row[5],   // DURATION
					(String) row[6],   // STATUS_NAME
					(String) row[7],   // TASK_NAME
					(Date) row[8] ,
					(Integer) row[9],
					(String) row[10],
					(String) row[11]// DATE
					));
		}
		return dtoList;
	}


	@Transactional
	public List<EmployeeWorkDetailsDTO> getEmployeeWorkDetails(Integer id, Date date) {
		List<Object[]> results = employeework_Repository.getEmployeeWorkDetailsMemeber(id, date);
		List<EmployeeWorkDetailsDTO> dtoList = new ArrayList<>();

		for (Object[] row : results) {
			dtoList.add(new EmployeeWorkDetailsDTO(
					(Integer) row[0],  // EMPLOYEE_ID
					(String) row[1],   // COMPANY_NAME
					(String) row[2],   // PROJECT_NAME
					(String) row[3],   // TECHNOLOGY_NAME
					(String) row[4],   // DESCRIPTION
					(Float) row[5],   // DURATION
					(String) row[6],   // STATUS_NAME
					(String) row[7],   // TASK_NAME
					(Date) row[8] ,
					(Integer) row[9],
					(String) row[10],
					(String) row[11]// DATE
					));
		}
		return dtoList;
	}

	@Transactional
	public List<EmployeeWorkDetailsDTO> getEmployeeWorkDetailsMember(Integer id, Date date) {
		List<Object[]> results = employeework_Repository.getEmployeeWorkDetails(id, date);
		List<EmployeeWorkDetailsDTO> dtoList = new ArrayList<>();

		for (Object[] row : results) {
			dtoList.add(new EmployeeWorkDetailsDTO(
					(Integer) row[0],  // EMPLOYEE_ID
					(String) row[1],   // COMPANY_NAME
					(String) row[2],   // PROJECT_NAME
					(String) row[3],   // TECHNOLOGY_NAME
					(String) row[4],   // DESCRIPTION
					(Float) row[5],   // DURATION
					(String) row[6],   // STATUS_NAME
					(String) row[7],   // TASK_NAME
					(Date) row[8] ,
					(Integer) row[9],
					(String) row[10],
					(String) row[11]// DATE
					));
		}
		return dtoList;
	}
	@Override
	@Transactional
	public List<Map<String, Object>> getScreensByEmployeeEmail(String email) {
		Integer roleId = employeeDetails_Repository.findRoleIdByEmail(email); // Write this custom query
		if (roleId == null) return Collections.emptyList();

		List<Object[]> screenData = roleScreenMapRepository.findScreensByRoleId(roleId); // Also write this custom query

		List<Map<String, Object>> screenList = new ArrayList<>();
		for (Object[] row : screenData) {
			Map<String, Object> screenMap = new HashMap<>();
			screenMap.put("id", row[0]);   // screen ID
			screenMap.put("type", row[1]); // screen type or name
			screenList.add(screenMap);
		}
		return screenList;
	}


	@Override
	@Transactional
	public boolean verifyValidEmail(LoginDto loginRequest) {
		String email=loginRequest.getEmailId();
		int atIndex = email.indexOf('@');
		int dotIndex = email.indexOf('.', atIndex);
		if (atIndex == -1 || dotIndex == -1 || dotIndex <= atIndex + 1) {
			return false; 
		}
		String emailDomain = email.substring(atIndex + 1, dotIndex).toLowerCase();
		List<String> allowedDomains = domainRepository.getDomain();
		for (String domain : allowedDomains) {
			if (emailDomain.equalsIgnoreCase(domain)) {
				return true;
			}
		}
		return false;
	}


	@Override
	@Transactional
	public boolean generateExcelProductionHour(Integer id, Integer month, Integer year, String fileName) {
		Path path = Paths.get(excelFilePath, fileName);
		XSSFWorkbook workbook = null;
		FileOutputStream fos = null;

		try {
			List<Company> companies = company_Repository.findAll();
			if (companies.isEmpty()) {
				log.warn("No company records found.");
				return false;
			}

			workbook = new XSSFWorkbook();
			fos = new FileOutputStream(path.toFile());

			// Font and styles
			Font headerFont = workbook.createFont();
			headerFont.setBold(true);
			headerFont.setFontHeightInPoints((short) 14);

			CellStyle headerStyle = workbook.createCellStyle();
			headerStyle.setFont(headerFont);
			headerStyle.setAlignment(HorizontalAlignment.CENTER);
			headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
			headerStyle.setBorderTop(BorderStyle.THIN);
			headerStyle.setBorderBottom(BorderStyle.THIN);
			headerStyle.setBorderLeft(BorderStyle.THIN);
			headerStyle.setBorderRight(BorderStyle.THIN);

			// Data cell style (with center alignment)
			CellStyle dataCellStyle = workbook.createCellStyle();
			dataCellStyle.setBorderTop(BorderStyle.THIN);
			dataCellStyle.setBorderBottom(BorderStyle.THIN);
			dataCellStyle.setBorderLeft(BorderStyle.THIN);
			dataCellStyle.setBorderRight(BorderStyle.THIN);
			dataCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

			// Right-align hours column
			CellStyle hoursCellStyle = workbook.createCellStyle();
			hoursCellStyle.cloneStyleFrom(dataCellStyle); // Inherit from dataCellStyle
			hoursCellStyle.setAlignment(HorizontalAlignment.RIGHT); // Right alignment for Hours column

			// Get month name
			String monthName = YearMonth.of(year, month).getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

			for (int i = 0; i < companies.size(); i++) {
				Company company = companies.get(i);
				String sheetName = company.getEntityCode() != null ? company.getEntityCode() : "Sheet" + i;
				sheetName = sheetName.length() > 31 ? sheetName.substring(0, 31) : sheetName;

				XSSFSheet sheet = workbook.createSheet(sheetName);
				sheet.createFreezePane(0, 2); // Freeze month and header rows

				// First row: Month name (Merged + Styled)
				Row monthRow = sheet.createRow(0);
				for (int col = 0; col <= 1; col++) {
					Cell cell = monthRow.createCell(col);
					if (col == 0) {
						cell.setCellValue("Month: " + monthName + " " + year);
					}

					// Apply yellow background, bold font, and borders
					Font boldFont = workbook.createFont();
					boldFont.setBold(true);
					CellStyle style = workbook.createCellStyle();
					style.setFont(boldFont);
					style.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
					style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
					style.setAlignment(HorizontalAlignment.LEFT);
					style.setVerticalAlignment(VerticalAlignment.CENTER);
					style.setBorderTop(BorderStyle.THIN);
					style.setBorderBottom(BorderStyle.THIN);
					style.setBorderLeft(BorderStyle.THIN);
					style.setBorderRight(BorderStyle.THIN);

					cell.setCellStyle(style);
				}
				sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 1)); // Merge A1 to B1

				// Second row: Header
				Row headerRow = sheet.createRow(1);
				headerRow.setHeightInPoints(20);
				String[] headers = {"Name", "Hours"};

				for (int j = 0; j < headers.length; j++) {
					Cell cell = headerRow.createCell(j);
					cell.setCellValue(headers[j]);
					cell.setCellStyle(headerStyle);
				}

				// Fetch data
				Optional<List<Object[]>> listOfData = employeework_Repository
						.fetchEntityWise(company.getEntityId(), month, year);

				double totalHours = 0.0;
				int rowIndex = 2; // Data starts from 3rd row

				if (listOfData.isPresent()) {
					for (Object[] rowData : listOfData.get()) {
						Row dataRow = sheet.createRow(rowIndex++);

						// Name
						Cell nameCell = dataRow.createCell(0);
						nameCell.setCellValue(rowData[0] != null ? rowData[0].toString() : "");
						nameCell.setCellStyle(dataCellStyle);

						// Hours (with right alignment)
						Cell hoursCell = dataRow.createCell(1);
						double hoursValue = 0.0;
						if (rowData[1] instanceof Number) {
							hoursValue = ((Number) rowData[1]).doubleValue();
						} else if (rowData[1] != null) {
							try {
								hoursValue = Double.parseDouble(rowData[1].toString());
							} catch (NumberFormatException ignored) {
							}
						}

						hoursCell.setCellValue(formatNumber(hoursValue));
						hoursCell.setCellStyle(hoursCellStyle); // Apply right alignment for Hours column
						totalHours += hoursValue;
					}

					// Total Row
					Row totalRow = sheet.createRow(rowIndex);
					Cell labelCell = totalRow.createCell(0);
					labelCell.setCellValue("Total Hours");
					labelCell.setCellStyle(headerStyle);

					Cell totalValueCell = totalRow.createCell(1);
					totalValueCell.setCellValue(formatNumber(totalHours));
					totalValueCell.setCellStyle(headerStyle);

					// Auto-size columns
					sheet.autoSizeColumn(0);
					sheet.autoSizeColumn(1);
				}
			}

			workbook.write(fos);
			log.info("Excel file generated successfully at: {}", path.toAbsolutePath());
			return true;

		} catch (Exception e) {
			log.error("Error while generating Excel file: ", e);
			return false;
		} finally {
			try {
				if (fos != null) fos.close();
				if (workbook != null) workbook.close();
			} catch (IOException e) {
				log.error("Error closing resources: ", e);
			}
		}
	}
	@Override
	@Transactional
	public boolean generateExcelProjectWiseEmployee(Integer projectId, Integer month, Integer year, String fileName) {
		Path path = Paths.get(excelFilePath, fileName);
		XSSFWorkbook workbook = null;
		FileOutputStream fos = null;

		try {
			List<Object[]> rawData = employeework_Repository
					.fetchWorkLogsByProjectMonthYear(projectId, month, year);

			if (rawData == null || rawData.isEmpty()) {
				log.warn("No data found for the given criteria.");
				return false;
			}

			Map<String, List<Object[]>> groupedByEmpCode = rawData.stream()
					.collect(Collectors.groupingBy(row -> row[1] != null ? row[1].toString() : "UNKNOWN"));

			workbook = new XSSFWorkbook();
			fos = new FileOutputStream(path.toFile());

			Font headerFont = workbook.createFont();
			headerFont.setBold(true);
			headerFont.setFontHeightInPoints((short) 12);

			Font boldFont = workbook.createFont();
			boldFont.setBold(true);
			boldFont.setFontHeightInPoints((short) 11);

			CellStyle yellowBoldStyle = workbook.createCellStyle();
			yellowBoldStyle.setFont(boldFont);
			yellowBoldStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
			yellowBoldStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
			yellowBoldStyle.setAlignment(HorizontalAlignment.LEFT);
			yellowBoldStyle.setVerticalAlignment(VerticalAlignment.CENTER);
			yellowBoldStyle.setBorderTop(BorderStyle.THIN);
			yellowBoldStyle.setBorderBottom(BorderStyle.THIN);
			yellowBoldStyle.setBorderLeft(BorderStyle.THIN);
			yellowBoldStyle.setBorderRight(BorderStyle.THIN);

			CellStyle headerStyle = workbook.createCellStyle();
			headerStyle.setFont(headerFont);
			headerStyle.setAlignment(HorizontalAlignment.CENTER);
			headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
			headerStyle.setBorderTop(BorderStyle.THIN);
			headerStyle.setBorderBottom(BorderStyle.THIN);
			headerStyle.setBorderLeft(BorderStyle.THIN);
			headerStyle.setBorderRight(BorderStyle.THIN);

			CellStyle dataCellStyle = workbook.createCellStyle();
			dataCellStyle.setBorderTop(BorderStyle.THIN);
			dataCellStyle.setBorderBottom(BorderStyle.THIN);
			dataCellStyle.setBorderLeft(BorderStyle.THIN);
			dataCellStyle.setBorderRight(BorderStyle.THIN);
			dataCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);



			CellStyle rightAlignCellStyle = workbook.createCellStyle();
			rightAlignCellStyle.cloneStyleFrom(dataCellStyle);
			rightAlignCellStyle.setAlignment(HorizontalAlignment.RIGHT);

			String[] headers = {"Date", "Employee Code", "Client", "Project Description", "Duration", "Status"};
			String[] headersOfEmployeeHours = {"Employee Code", "Employee Name", "Total Hours"};
			String monthName = YearMonth.of(year, month).getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

			List<Object[]> listOfEmployeeHoursProjectWise = employeework_Repository.employeeHoursProjectWise(projectId, month);
			Optional<Project> project=project_Repository.findById(projectId);
			String clientName=project.get().getClientName();
			XSSFSheet sheet = workbook.createSheet("Employee Hours");
			sheet.createFreezePane(0, 3);

			// Row 0: Month Name
			Row monthRow = sheet.createRow(0);
			for (int i = 0; i < headersOfEmployeeHours.length; i++) {
				Cell cell = monthRow.createCell(i);
				cell.setCellStyle(yellowBoldStyle);
				if (i == 0) {
					cell.setCellValue("Month: " + monthName + " " + year);
				}
			}
			sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 2));

			// Row 1: Client Name
			Row clientRow = sheet.createRow(1);
			for (int i = 0; i < headersOfEmployeeHours.length; i++) {
				Cell cell = clientRow.createCell(i);
				cell.setCellStyle(yellowBoldStyle);
				if (i == 0) {
					cell.setCellValue("Client: " + clientName);
				}
			}
			sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 2));

			// Row 2: Headers
			Row headerRow = sheet.createRow(2);
			for (int i = 0; i < headersOfEmployeeHours.length; i++) {
				Cell cell = headerRow.createCell(i);
				cell.setCellValue(headersOfEmployeeHours[i]);
				cell.setCellStyle(headerStyle);
			}

			CreationHelper creationHelper = workbook.getCreationHelper();

			Font hlinkFont = workbook.createFont();
			hlinkFont.setUnderline(Font.U_SINGLE);
			hlinkFont.setColor(IndexedColors.BLUE.getIndex());

			CellStyle hyperlinkWithBorder = workbook.createCellStyle();
			hyperlinkWithBorder.cloneStyleFrom(dataCellStyle); // inherits borders, alignments
			hyperlinkWithBorder.setFont(hlinkFont); 

			int rowIndex1 = 3;
			for (Object[] obj : listOfEmployeeHoursProjectWise) {
				Row row = sheet.createRow(rowIndex1++);
				String empCode = obj[0] != null ? obj[0].toString() : "";

				Cell empCell = row.createCell(0);
				empCell.setCellValue(empCode);

				Hyperlink empLink = creationHelper.createHyperlink(HyperlinkType.DOCUMENT);
				empLink.setAddress("'" + empCode + "'!A1");
				empCell.setHyperlink(empLink);
				empCell.setCellStyle(hyperlinkWithBorder);


				// Other cells
				row.createCell(1).setCellValue(obj[1] != null ? obj[1].toString() : "");
				Cell durationCell = row.createCell(2);
				durationCell.setCellValue(obj[2] != null ? obj[2].toString() : "");
				durationCell.setCellStyle(rightAlignCellStyle);

				// Apply dataCellStyle to column 0 and 1 if not hyperlink
				row.getCell(1).setCellStyle(dataCellStyle);
			}

			for (int i = 0; i < headersOfEmployeeHours.length; i++) {
				sheet.autoSizeColumn(i);
			}

			for (Map.Entry<String, List<Object[]>> entry : groupedByEmpCode.entrySet()) {
				String empCode = entry.getKey();
				List<Object[]> empData = entry.getValue();

				String sheetName = empCode.length() > 31 ? empCode.substring(0, 31) : empCode;
				sheet = workbook.createSheet(sheetName);
				sheet.createFreezePane(0, 3);

				// Row 0: Month
				Row monthRowEmp = sheet.createRow(0);
				for (int i = 0; i < headers.length; i++) {
					Cell cell = monthRowEmp.createCell(i);
					cell.setCellStyle(yellowBoldStyle);
					if (i == 0) {
						cell.setCellValue("Month: " + monthName + " " + year);
					}
				}
				sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));

				// Row 1: Client
				Row clientRowEmp = sheet.createRow(1);
				for (int i = 0; i < headers.length; i++) {
					Cell cell = clientRowEmp.createCell(i);
					cell.setCellStyle(yellowBoldStyle);
					if (i == 0) {

						cell.setCellValue("Client: " + clientName);
					}
				}
				sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 5));

				// Row 2: Headers
				headerRow = sheet.createRow(2);
				for (int i = 0; i < headers.length; i++) {
					Cell cell = headerRow.createCell(i);
					cell.setCellValue(headers[i]);
					cell.setCellStyle(headerStyle);
				}

				// Data rows
				int rowIndex = 3;
				for (Object[] row : empData) {
					Row dataRow = sheet.createRow(rowIndex++);
					dataRow.createCell(0).setCellValue(row[0] != null ? row[0].toString() : "");
					dataRow.createCell(1).setCellValue(row[1] != null ? row[1].toString() : "");
					dataRow.createCell(2).setCellValue(row[2] != null ? row[2].toString() : "");
					dataRow.createCell(3).setCellValue(row[3] != null ? row[3].toString() : "");

					Cell durationCell = dataRow.createCell(4);
					durationCell.setCellValue(row[4] != null ? row[4].toString() : "");
					durationCell.setCellStyle(rightAlignCellStyle);

					Cell statusCell = dataRow.createCell(5);
					statusCell.setCellValue(row[5] != null ? row[5].toString() : "");
					statusCell.setCellStyle(rightAlignCellStyle);

					for (int col = 0; col < 6; col++) {
						if (col != 4 && col != 5) {
							dataRow.getCell(col).setCellStyle(dataCellStyle);
						}
					}
				}

				for (int i = 0; i < headers.length; i++) {
					sheet.autoSizeColumn(i);
				}
			}

			workbook.write(fos);
			log.info("Excel file generated successfully at: {}", path.toAbsolutePath());
			return true;

		} catch (Exception e) {
			log.error("Error while generating Excel file: ", e);
			return false;
		} finally {
			try {
				if (fos != null) fos.close();
				if (workbook != null) workbook.close();
			} catch (IOException e) {
				log.error("Error closing resources: ", e);
			}
		}
	}


	@Override
	@Transactional
	public List<Map<String, Object>> getUserDetails(String username) {
		List<Object[]> results = employeeDetails_Repository.userInfoByEmail(username);
		List<Map<String, Object>> userDetailsList = new ArrayList<>();

		for (Object[] result : results) {
			Map<String, Object> userDetailsMap = new HashMap<>();
			userDetailsMap.put("roleId", result[0]);
			userDetailsMap.put("companyId", result[1]);
			userDetailsMap.put("entityCode", result[2]);
			userDetailsMap.put("employeeId", result[3]);
			userDetailsMap.put("password", result[4]);
			userDetailsMap.put("firstLogin", result[5]);
			userDetailsList.add(userDetailsMap);
		}

		return userDetailsList;
	}

	@Override
	@Transactional
	public DashboardDto dashboardgetdata(List<Integer> months) {
		DashboardDto dashboardDto = new DashboardDto();

		try {
			dashboardDto.setTotalWorkingHours(employeework_Repository.getTotalWorkingHours(months));
			dashboardDto.setLossHours(employeework_Repository.getOverallAvgLostHours(months));
			dashboardDto.setProjectMembers(employeework_Repository.getEmployeeCountPerProject());
			dashboardDto.setAverageWorking(employeework_Repository.getAvgWorkingHoursAllEmployees());
		} catch (Exception e) {

			log.error("Error in dashboardgetdata: {}", e.getMessage(), e);
		}

		return dashboardDto;
	}

	@Override
	@Transactional
	public String uploadExcelRead(MultipartFile excelfile) throws ParseException {
		log.info("Excel upload method triggered");

		if (excelfile == null || excelfile.isEmpty()) {
			log.warn("Uploaded file is null or empty");
			return "File is empty or not uploaded!";
		}

		try (InputStream fileInputStream = excelfile.getInputStream();
				HSSFWorkbook workbook = new HSSFWorkbook(fileInputStream)) {

			HSSFSheet sheet = workbook.getSheetAt(0);
			log.info("Reading sheet: " + sheet.getSheetName());

			int numberOfRows = sheet.getPhysicalNumberOfRows();
			if (numberOfRows == 0) {
				log.warn(" Sheet is empty");
				return "Sheet is empty";
			}

			Integer empcodeIndex = null;
			Integer intimeIndex = null;
			Integer outtimeIndex = null;
			Integer statusIndex = null;

			int headerRowIndex = -1;
			String entityname=null;
			String formattedDate=null;
			// 1. Find header row
			for (int i = 0; i < numberOfRows; i++) {
				Row row = sheet.getRow(i);
				if (row != null) {
					for (int j = 0; j < row.getPhysicalNumberOfCells(); j++) {
						Cell cell = row.getCell(j);
						if (cell != null && cell.getCellType() == CellType.STRING) {
							String cellValue = cell.getStringCellValue().trim();
							Pattern iagamiPattern = Pattern.compile("([A-Za-z]{3}\\s\\d{1,2}\\s\\d{4})\\s+To\\s+([A-Za-z]{3}\\s\\d{1,2}\\s\\d{4})");
							Pattern bsecPattern = Pattern.compile("(\\d{2}/\\d{2}/\\d{4})");

							Matcher iagamiMatcher = iagamiPattern.matcher(cellValue);
							Matcher bsecMatcher = bsecPattern.matcher(cellValue);

							if (iagamiMatcher.find()) {
								String iagamiDateStr = iagamiMatcher.group(1); // e.g., "Apr 11 2025"
								SimpleDateFormat inputFormat = new SimpleDateFormat("MMM dd yyyy");
								SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
								Date date = inputFormat.parse(iagamiDateStr);
								formattedDate = outputFormat.format(date);
							}

							if (bsecMatcher.find()) {
								String bsecDateStr = bsecMatcher.group(1); // e.g., "11/04/2025"
								SimpleDateFormat inputFormat = new SimpleDateFormat("dd/MM/yyyy"); // <- FIXED here
								SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");

								Date date = inputFormat.parse(bsecDateStr);
								formattedDate = outputFormat.format(date);

								System.out.println("Formatted Date (BSEC): " + formattedDate); // Output: 2025-04-11
							}

							if(cellValue.contains("iAgami")) {
								entityname="iAgami";
							}
							else if(cellValue.contains("Bsec")) {
								entityname="B-sec";
							}

							if (cellValue.equalsIgnoreCase("E. Code") || cellValue.equalsIgnoreCase("Empcode")) {
								headerRowIndex = i;
								break;
							}
						}
					}
				}
				if (headerRowIndex != -1) break;
			}
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date date = sdf.parse(formattedDate);

			//date validation need to be do
			Integer numberofRows=fingerprintDataRepository.findByDate(date,entityname);
			if(numberofRows>=1) {
				return "This Date Data is already Submitted";
			}
			if (headerRowIndex == -1) {
				log.warn(" Header row not found");
				return "Header row with 'E. Code' not found";
			}

			// 2. Get the index of required columns
			Row headerRow = sheet.getRow(headerRowIndex);
			for (int j = 0; j < headerRow.getPhysicalNumberOfCells(); j++) {
				Cell cell = headerRow.getCell(j);
				if (cell != null && cell.getCellType() == CellType.STRING) {
					String name = cell.getStringCellValue().trim();
					if (name.equalsIgnoreCase("E. Code") || name.equalsIgnoreCase("Empcode")) empcodeIndex = j;
					if (name.equalsIgnoreCase("InTime")) intimeIndex = j;
					if (name.equalsIgnoreCase("OutTime")) outtimeIndex = j;
					if (name.equalsIgnoreCase("Status")) statusIndex = j;
				}
			}

			if (empcodeIndex == null || intimeIndex == null || outtimeIndex == null || statusIndex == null) {
				log.warn("One or more required columns not found");
				return "Required columns ('E. Code', 'InTime', 'OutTime', 'Status') not found";
			}

			SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");
			int lastRowNum = sheet.getLastRowNum(); 
			if(entityname.equalsIgnoreCase("iagami")) numberOfRows=lastRowNum;
			else numberOfRows=lastRowNum-1;


			for (int i = headerRowIndex + 1; i < numberOfRows; i++) {
				Row row = sheet.getRow(i);
				if (row == null || row.getPhysicalNumberOfCells() == 0) continue;

				try {
					Cell empCell = row.getCell(empcodeIndex);
					Cell statusCell = row.getCell(statusIndex);

					if (empCell == null) continue;

					String empCode = empCell.getCellType() == CellType.STRING
							? empCell.getStringCellValue().trim()
									: String.valueOf((int) empCell.getNumericCellValue());

					String status = (statusCell != null && statusCell.getCellType() == CellType.STRING)
							? statusCell.getStringCellValue().trim().toLowerCase()
									: "";

					FingerprintData data = new FingerprintData();
					data.setEmployeeCode(empCode);

					data.setDate(date);
					if (status.equalsIgnoreCase("p") || status.equalsIgnoreCase("present")|| status.equalsIgnoreCase("Absent (No OutPunch)")) {
						Cell inCell = row.getCell(intimeIndex);
						Cell outCell = row.getCell(outtimeIndex);

						if (inCell == null || outCell == null) continue;

						String inTimeStr = inCell.getStringCellValue().trim();  // e.g. "10:01"
						String outTimeStr = outCell.getStringCellValue().trim(); // e.g. "18:30"
						inTimeStr = sanitizeTimeString(inTimeStr);
						outTimeStr = sanitizeTimeString(outTimeStr);


						// Convert HH:mm → HH.mm as double (e.g. 10:01 → 10.01)
						String[] inParts = inTimeStr.split(":");
						String[] outParts = outTimeStr.split(":");

						double inTimeAsDouble = Double.parseDouble(inParts[0] + "." + String.format("%02d", Integer.parseInt(inParts[1])));
						double outTimeAsDouble = Double.parseDouble(outParts[0] + "." + String.format("%02d", Integer.parseInt(outParts[1])));

						double totalHours = Math.round((outTimeAsDouble - inTimeAsDouble) * 100.0) / 100.0;
						data.setEntityCode(entityname);
						data.setInTime(inTimeAsDouble);
						data.setOutTime(outTimeAsDouble);
						if(outTimeAsDouble==0.0)data.setHours(0.0);
						else data.setHours(totalHours);
					} else {
						data.setEntityCode(entityname);
						data.setInTime(null);
						data.setOutTime(null);
						data.setHours(0.0);
					}

					fingerprintDataRepository.save(data);
				} catch (Exception e) {
					log.error(" Error processing row {}: {}", i, e.getMessage());
				}
			}

		} catch (IOException e) {
			log.error("Error reading Excel file", e);
			return "Error reading Excel file: " + e.getMessage();
		}

		return "Excel file processed successfully!";
	}


	private String sanitizeTimeString(String timeStr) {
		if (timeStr.isEmpty() || timeStr.equals("--:--")) {
			return "0:0";
		}
		return timeStr;
	}



	@Override
	@Transactional
	public String deleteWorkId(TimesheetDeleteDTO timesheetDeleteDTO) {
		int deleted=employeework_Repository.updateDeleteFlagInWorkDetails(timesheetDeleteDTO.getWorkId());
		return deleted>0?"Deleted":"NotDeleted";
	}
	@Override
	public  List<Integer> getAllDataTeamlead(Integer id){
		System.out.println("Repository is null? " + (employeework_Repository == null));
		List<Integer> teamMembers= new ArrayList<Integer>();
		teamMembers.addAll(employeework_Repository.getAllTeamLead(id));
		return teamMembers;
	}


	@Override
	@Transactional
	public List<MonthlyDataDTO> getAllDataAll(MonthExcelDTO monthDataDto) {
		List<MonthlyDataDTO> dtoList = new ArrayList<>();

		try {
			List<Integer> teammembers=employeework_Repository.getAllTeamLead(monthDataDto.getEmployeeId());
			Optional<List<Object[]>> employeeData = employeework_Repository.getEmployeeDataAll(
					teammembers, 
					monthDataDto.getMonth(), 
					monthDataDto.getYear()
					);
			if (employeeData.isPresent()) {
				dtoList = employeeData.get().stream()
						.map(row -> new MonthlyDataDTO(
								(Date) row[0],  // DATE
								(String) row[1], // ENTITY_NAME
								(String) row[2], // PROJECT_NAME
								(String) row[3], // TECHNOLOGY_NAME
								(String) row[4], // DESCRIPTION
								(Float) row[5],  
								(String) row[6], // STATUS
								(String) row[7], // TASK_STATUS
								(String) row[8],
								(Integer) row[9],
								(String) row[10],
								(Integer) row[11]// REMARK
								))
						.collect(Collectors.toList());

				log.info("Successfully retrieved {} records.", dtoList.size());
			} else {
				log.warn("No data found for user {} in month {} and year {}", 
						monthDataDto.getEmployeeId(), 
						monthDataDto.getMonth(), 
						monthDataDto.getYear());
			}
		} catch (Exception e) {
			log.error("Error retrieving timesheet for user {} in month {} and year {}", 
					monthDataDto.getEmployeeId(), 
					monthDataDto.getMonth(), 
					monthDataDto.getYear(), e);
		}

		return dtoList;
	}

	@Override
	@Transactional
	public List<MonthDataDuration>  extractDataAll(List<MonthlyDataDTO> monthdata,List<Integer> id) {
		List<Date> dates= new ArrayList<Date>();

		for(MonthlyDataDTO m:monthdata) {
			dates.add((Date) m.getDate());
		}
		Set<Date> uniqueEmployeeNumbers = new HashSet<>(dates);
		List<Date> employeeIds = new ArrayList<>(uniqueEmployeeNumbers);
		Set<Integer> uniqueEmployeeNumbersId= new HashSet<>(id);
		List<Integer> employeeIds2 = new ArrayList<>(uniqueEmployeeNumbersId);
		List<MonthDataDuration> monthdatas=new ArrayList<MonthDataDuration>();
		for(Integer n:employeeIds2) {
			for(Date d:employeeIds) {
				MonthDataDuration monthlydata=new MonthDataDuration();
				monthlydata.setName(employeeDetails_Repository.findById(n).get().getEmployeeFirstName());
				monthlydata.setDate(d);
				monthlydata.setDuration(employeework_Repository.durationOfEmployee(n,d ));
				List<EmployeeWorkDetailsDTO> dateDataFromCustom=getEmployeeWorkDetails(n,d );
				monthlydata.setData(dateDataFromCustom);
				if(!dateDataFromCustom.isEmpty()) {
					monthdatas.add(monthlydata);
				}

			}
		}
		return  monthdatas;

	}
	@Override
	public DashboardDto dashboardgetdata(Integer months) {
		DashboardDto dashboardDto = new DashboardDto();

		try {
			dashboardDto.setTotalWorkingHours(employeework_Repository.getTotalWorkingHours(months));
			dashboardDto.setLossHours(employeework_Repository.getOverallAvgLostHours(months));
			dashboardDto.setProjectMembers(employeework_Repository.getEmployeeCountPerProject(months));
			dashboardDto.setAverageWorking(employeework_Repository.getAvgWorkingHoursAllEmployees(months)); // or extract just one if needed
			dashboardDto.setMonthWorkingExtraHour(employeework_Repository.getAbove9HoursByMonth(months));
			dashboardDto.setMonthWorkingBalanceHour(employeework_Repository.getBalanceTo9HoursByMonthWise(months));
		} catch (Exception e) {

			log.error("Error in dashboardgetdata: {}", e.getMessage(), e);
		}

		return dashboardDto;
	}




	@Override
	public List<EntityProjectsDTO> getProjectForExcel(Integer employeeId) {
	    Optional<EmployeeDetails> employeeDetailsOpt = employeeDetails_Repository.findById(employeeId);

	    if (employeeDetailsOpt.isEmpty()) {
	        return Collections.emptyList();
	    }

	    EmployeeDetails employeeDetails = employeeDetailsOpt.get();
	    int roleId = employeeDetails.getRoleId();

	    List<EntityProjectsDTO> projectDTOs;

	    if (roleId > 2) {
	        // Admin or Manager – return all projects
	        List<Project> projects = project_Repository.findAll();
	        projectDTOs = projects.stream().map(project -> {
	            EntityProjectsDTO dto = new EntityProjectsDTO();
	            dto.setProjectId(project.getProjectId());
	            dto.setProjectCode(project.getProjectCode());
	            dto.setClientName(project.getClientName());
	            return dto;
	        }).collect(Collectors.toList());
	    } else {
	        // Team lead – get projects using raw query
	        List<Object[]> rawProjects = teamLeadProjectMap.findRawProjectsByEmployeeId(employeeId);
	        projectDTOs = rawProjects.stream().map(obj -> {
	            EntityProjectsDTO dto = new EntityProjectsDTO();
	            dto.setProjectId((Integer) obj[0]);
	            dto.setProjectCode((String) obj[1]);
	            dto.setClientName((String) obj[2]);
	            return dto;
	        }).collect(Collectors.toList());
	    }

	    return projectDTOs;
	}


	@Override

	@Transactional

	public List<HistoryDto> getModifyHistory(DateFormatDto dateformat) {

		Optional<ReportingManager> TeamLeadCheck=reporting_ManagerRepository.findByManagerEmployeeId(dateformat.getUserId());

		if(TeamLeadCheck.isEmpty()) {

			throw new RuntimeException("You are not a TeamLead: " + dateformat.getUserId());

		}

		List<Object[]> history=employeework_Repository.historyData(dateformat.getUserId(),dateformat.getDate(),dateformat.getMonth(),dateformat.getYear());

		if (history.isEmpty()) {

			throw new RuntimeException("No records found for the given date: " + dateformat);

		}

		List<HistoryDto> historyList = new ArrayList<>();

		for (Object[] row : history) {

			HistoryDto dto = new HistoryDto();

			dto.setEmployeeCode((String) row[0]);

			dto.setEmployeeFirstName((String) row[1]);

			dto.setEntityName((String) row[2]);

			dto.setProjectName((String) row[3]);

			dto.setClientName((String) row[4]);

			dto.setDescription((String) row[5]);

			dto.setDuration(row[6] != null ? ((Number) row[6]).floatValue() : null);

			dto.setStatusName((String) row[7]);

			dto.setRemarks((String) row[8]);

			historyList.add(dto);

		}

		System.out.println(TeamLeadCheck.get().toString());

		return historyList;

	}
	

}


