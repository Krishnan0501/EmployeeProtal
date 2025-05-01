package com.iagami.employee.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.iagami.employee.dto.ApiResponse;
import com.iagami.employee.dto.*;
import com.iagami.employee.dto.EmpIdCode;
import com.iagami.employee.dto.EmployeeDetailDTO;
import com.iagami.employee.dto.EntityProductionHours;
import com.iagami.employee.dto.EntityProjectsDTO;
import com.iagami.employee.dto.LoginDto;
import com.iagami.employee.dto.LoginResponse;
import com.iagami.employee.dto.MonthDataDuration;
import com.iagami.employee.dto.MonthEnum;
import com.iagami.employee.dto.MonthExcelDTO;
import com.iagami.employee.dto.MonthExcelMultipleDTO;
import com.iagami.employee.dto.MonthlyDataDTO;
import com.iagami.employee.dto.ProjectWiseEmployee;
import com.iagami.employee.dto.ReturnTodayDataDTO;
import com.iagami.employee.dto.ReturnTodayDataDTO1;
import com.iagami.employee.dto.TeamLeadAcceptanceDTO;
import com.iagami.employee.dto.TeamLeadDataEmployeeAsWell;
import com.iagami.employee.dto.TimesheetDTO;
import com.iagami.employee.dto.TimesheetDeleteDTO;
import com.iagami.employee.dto.UserDeatilsSignUp;
import com.iagami.employee.dto.UserDetailsDto;
import com.iagami.employee.entity.EmployeeDetails;
import com.iagami.employee.securityjwt.JwtUtils;
import com.iagami.employee.serviceInterface.Service_Interface;

@RestController
@RequestMapping("/api/employee")
public class employeeController {
	@Autowired
	private  Service_Interface service_Interface;
	@Autowired
	private JwtUtils jwtUtils;
	@Autowired
	private AuthenticationManager authenticationManager;
	private static final Logger logger = LoggerFactory.getLogger(employeeController.class);

	@PostMapping("/signin")
	public ResponseEntity<ApiResponse> authenticateUser(@RequestBody LoginDto loginRequest) {
		logger.info("Login attempt for email: {}", loginRequest.getEmailId());
		ApiResponse apiResponse = new ApiResponse();

		try {
			// Step 1: Input validation
			String validationMessage = validateUser(loginRequest);
			if (!validationMessage.isEmpty()) {
				apiResponse.setResponseCode("400");
				apiResponse.setResponseMessage(validationMessage);
				apiResponse.setData(null);
				return ResponseEntity.badRequest().body(apiResponse);
			}

			// Step 2: Domain validation
			boolean validEmailDomain = service_Interface.verifyValidEmail(loginRequest);
			if (!validEmailDomain) {
				apiResponse.setResponseCode("400");
				apiResponse.setResponseMessage("Invalid email domain. Only specific domains are allowed.");
				apiResponse.setData(null);
				return ResponseEntity.badRequest().body(apiResponse);
			}

			// Step 3: Spring Security Authentication
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(
							loginRequest.getEmailId(),
							loginRequest.getPassword()
							)
					);

			SecurityContextHolder.getContext().setAuthentication(authentication);
			UserDetails userDetails = (UserDetails) authentication.getPrincipal();

			// Step 4: Generate JWT token
			String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);
			List<String> roles = userDetails.getAuthorities().stream()
					.map(item -> item.getAuthority())
					.collect(Collectors.toList());
			List<Map<String, Object>> screenAccess = service_Interface.getScreensByEmployeeEmail(userDetails.getUsername());
			List<Map<String, Object>> userDetailsfromDB = service_Interface.getUserDetails(userDetails.getUsername());

			LoginResponse response = new LoginResponse();
			response.setUsername(userDetails.getUsername());
			response.setRoles(roles);
			response.setScreenAccess(screenAccess); // Add this
			response.setJwtToken(jwtToken);

			if (!userDetailsfromDB.isEmpty()) {
				Map<String, Object> userMap = userDetailsfromDB.get(0);
				response.setRoleId((Integer)userMap.get("roleId"));
				response.setEmployeeId((Integer) userMap.get("employeeId"));    
				response.setEntityId((Integer) userMap.get("companyId"));         
				response.setEntityCode((String) userMap.get("entityCode"));        
				response.setFirstlogin((boolean)userMap.get("firstLogin")); 
				String encodedPassword = (String) userMap.get("password");
				byte[] decodedBytes = Base64.getDecoder().decode(encodedPassword);
				String decodedPassword = new String(decodedBytes);
				response.setPassword(decodedPassword);	
				}
			apiResponse.setResponseCode("200");
			apiResponse.setResponseMessage("Authorized");
			apiResponse.setData(response);
			return ResponseEntity.ok(apiResponse);

		} catch (AuthenticationException e) {
			logger.error("Authentication failed for user: {}", loginRequest.getEmailId(), e);
			apiResponse.setResponseCode("401");
			apiResponse.setResponseMessage("Unauthorized: Invalid credentials");
			apiResponse.setData(null);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
		} catch (Exception e) {
			logger.error("Unexpected error during login", e);
			apiResponse.setResponseCode("500");
			apiResponse.setResponseMessage("Internal server error: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
		}
	}


	public String validateUser(LoginDto loginDto) {
		logger.info("----- UserValidation Start -----");
		try {
			if (loginDto == null) return "User details cannot be null";
			if (loginDto.getEmailId() == null || !loginDto.getEmailId().matches("^[A-Za-z0-9+_.-]+@(.+)$"))
				return "Invalid Email Id format";
			if (loginDto.getPassword() == null || loginDto.getPassword().length() < 8)
				return "Password must be at least 8 characters long";

			boolean emailNotExist = service_Interface.userDetailsServiceExistId(loginDto.getEmailId());
			if (emailNotExist) return "Mail not exist";

			String encodedPassword = service_Interface.UserDeatilsServicePasswordCheck(loginDto.getEmailId());
			if (encodedPassword == null) return "Password not set for user";

			if (!loginDto.getPassword().equals(decodeuserpassword(encodedPassword)))
				return "Password incorrect";

			return "";
		} catch (Exception e) {
			logger.error("Error in validateUser: {}", e.getMessage(), e);
			return "Validation error";
		} finally {
			logger.info("----- UserValidation End -----");
		}
	}




	public static String   encrptuserpassword(String password) {
		return Base64.getEncoder().encodeToString(password.getBytes());
	}
	public static String decodeuserpassword(String encodedPassword) {
		byte[] decodedBytes = Base64.getDecoder().decode(encodedPassword);
		return new String(decodedBytes);
	}


	@PostMapping("/addUser")
	public ResponseEntity<?> addUserToDatabase(@RequestBody UserDeatilsSignUp userDeatilsSignUp) {
		try {
			logger.info("------------------- UserController addUserToDatabase Start ------------------------");
			userDeatilsSignUp.setPassword(encrptuserpassword(userDeatilsSignUp.getPassword()));
			String validationMessage = validateUseradduser(userDeatilsSignUp);
			if (!validationMessage.isEmpty()) {
				ApiResponse responsevo = new ApiResponse();
				responsevo.setResponseCode("400");
				responsevo.setResponseMessage(validationMessage);
				responsevo.setData(null);
				return ResponseEntity.badRequest()
						.body(responsevo);
			}	else {
				service_Interface.insertIntoDb(userDeatilsSignUp);
				ApiResponse responsevo = new ApiResponse();
				responsevo.setResponseCode("200");
				responsevo.setResponseMessage("Success");
				responsevo.setData(null);
				return ResponseEntity.ok(responsevo);
			}
		} catch (Exception e) {
			ApiResponse responsevo = new ApiResponse();
			responsevo.setResponseCode("500");
			responsevo.setResponseMessage("Internal server error: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responsevo);
		} finally {
			logger.info("------------------- UserController addUserToDatabase End ------------------------");
		}
	}
	public String validateUseradduser(UserDeatilsSignUp userDetailsDto) {
		logger.info("------------------------ validateUseradduser Start ------------------------");

		try {
			if (userDetailsDto == null) {
				return "User details cannot be null";
			}
			else if (userDetailsDto.getEmailId() == null || !userDetailsDto.getEmailId().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
				return "Email Id cannot be empty";
			}
			else if (userDetailsDto.getPassword() == null || userDetailsDto.getPassword().length() < 8) {
				return "Password must be at least 8 characters long";
			} 
			else {
				boolean emailidexist =service_Interface.userDetailsServiceExistId(userDetailsDto.getEmailId()); 
				boolean employeeId=service_Interface.userServiceGetEmployeecode(userDetailsDto.getEmployeeCode());
				boolean employeeCodeInEmployee=service_Interface.employeeIdExist(userDetailsDto.getEmployeeCode());
				boolean employeeMail=service_Interface.employeeMailCheckEmployeeTable(userDetailsDto.getEmailId());
				if(!emailidexist) {
					return "Mail Already Exist";
				}
				if(employeeId) {
					return "Employee Code is already exist"; 	
				}
				if(employeeCodeInEmployee) {
					return "Code Not exist in Employee Table";
				}
				if(employeeMail) {
					return "Mail not exist in Employee table";
				}

				return "";

			}
		} catch (Exception e) {
			logger.error("EXCEPTION: Error occurred during validation - {}", e.getMessage(), e);
			return "Error occurred during validation";
		} finally {
			logger.info("------------------------ validateUseradduser End ------------------------");
		}
	}
	@PutMapping("/updateUser")
	public ResponseEntity<?>  updateUserDetails(@RequestBody LoginDto loginDto) {
		String validateemailexist=updateValidateUser(loginDto);
		System.out.println(loginDto.getEmailId());
		if(!validateemailexist.isEmpty()) {
			ApiResponse responsevo = new ApiResponse();
			responsevo.setResponseCode("400");
			responsevo.setResponseMessage(validateemailexist);
			responsevo.setData(null);
			return ResponseEntity.badRequest()
					.body(responsevo);
		}
		else {

			loginDto.setPassword(encrptuserpassword( loginDto.getPassword()));
			UserDetailsDto userDetailsDto=  service_Interface.getUpdateDate(loginDto);
			ApiResponse responsevo = new ApiResponse();
			responsevo.setResponseCode("200");
			responsevo.setResponseMessage("Success");
			responsevo.setData(userDetailsDto);
			return ResponseEntity.ok(responsevo);
		}

	}

	public String updateValidateUser(LoginDto userDetailsDto) {
		logger.info("------------------------ UserValidation Start ------------------------");

		try {
			if (userDetailsDto == null) {
				return "User details cannot be null";
			}
			else if (userDetailsDto.getEmailId() == null || !userDetailsDto.getEmailId().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
				System.out.println(userDetailsDto.getEmailId());
				return "Email Id cannot be empty";
			}
			else if (userDetailsDto.getPassword() == null || userDetailsDto.getPassword().length() < 8) {
				return "Password must be at least 8 characters long";
			} 
			else {
				boolean emailidexist =service_Interface.userDetailsServiceExistId(userDetailsDto.getEmailId());

				if(emailidexist) {
					return "Mail Not Exist";
				}
				return "";
			}
		} catch (Exception e) {
			logger.error("EXCEPTION: Error occurred during validation - {}", e.getMessage(), e);
			return "Error occurred during validation";
		} finally {
			logger.info("------------------------ validateUseradduser End ------------------------");
		}
	}





	@GetMapping("/company/employees/{employeeId}")
	public ResponseEntity<ApiResponse<List<EmployeeDetailDTO>>> getEmployeeDetails(@PathVariable int employeeId) {
		logger.info("Received request to fetch employee details");
		ApiResponse<List<EmployeeDetailDTO>> apiResponse = new ApiResponse<>();
		try {
			List<EmployeeDetailDTO> employeeList = service_Interface.getEmployeedata(employeeId);
			logger.debug("Fetched {} employee records", employeeList != null ? employeeList.size() : 0);
			if (employeeList == null || employeeList.isEmpty()) {
				logger.warn("No employee records found");
				apiResponse.setResponseCode("404");
				apiResponse.setResponseMessage("No Records Found");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
			}
			apiResponse.setResponseCode("200");
			apiResponse.setResponseMessage("Records Retrieved Successfully");
			apiResponse.setData(employeeList);
			logger.info("Returning {} employee records successfully", employeeList.size());
			return ResponseEntity.ok(apiResponse);
		} catch (Exception e) {
			logger.error("Error fetching employee details", e);
			apiResponse.setResponseCode("500");
			apiResponse.setResponseMessage("Please Contact Admin...");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
		}
	}
	@GetMapping("/entity")
	public ResponseEntity<ApiResponse<List<CompanyDTO>>> getCompanyEntities() {
		logger.info("Received request to fetch company entities");

		ApiResponse<List<CompanyDTO>> apiResponse = new ApiResponse<>();
		try {
			List<CompanyDTO> companyList = service_Interface.getCompany();
			logger.debug("Fetched {} company entities", companyList != null ? companyList.size() : 0);

			if (companyList == null || companyList.isEmpty()) {
				logger.warn("No company entities found");
				apiResponse.setResponseCode("404");
				apiResponse.setResponseMessage("No Records Found for the Entity");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
			}

			apiResponse.setResponseCode("200");
			apiResponse.setResponseMessage("Entity Retrieved Successfully");
			apiResponse.setData(companyList);
			logger.info("Returning {} company entities successfully", companyList.size());
			return ResponseEntity.ok(apiResponse);

		} catch (Exception e) {
			logger.error("Error fetching company entities", e);
			apiResponse.setResponseCode("500");
			apiResponse.setResponseMessage("Please Contact Admin...");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
		}
	}
	//get projects for company wise
	@GetMapping("/entity/{company_id}")
	public ResponseEntity<ApiResponse<List<EntityProjectsDTO>>> getCompanyProjects(@PathVariable Integer company_id) {
		logger.info("Received request to fetch projects for company_id: {}", company_id);

		if (company_id < 1) {
			logger.warn("Invalid company_id: {}. It must be greater than zero.", company_id);
			throw new IllegalArgumentException("Company ID should not be zero or negative");
		}

		ApiResponse<List<EntityProjectsDTO>> apiResponse = new ApiResponse<>();
		try {
			List<EntityProjectsDTO> projectList = service_Interface.getProjects(company_id);
			logger.debug("Fetched {} projects for company_id: {}", 
					projectList != null ? projectList.size() : 0, company_id);

			if (projectList == null || projectList.isEmpty()) {
				logger.warn("No projects found for company_id: {}", company_id);
				apiResponse.setResponseCode("404");
				apiResponse.setResponseMessage("No Projects Found for this ID: " + company_id);
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
			}

			apiResponse.setResponseCode("200");
			apiResponse.setResponseMessage("Projects Retrieved Successfully");
			apiResponse.setData(projectList);
			logger.info("Returning {} projects for company_id: {}", projectList.size(), company_id);
			return ResponseEntity.ok(apiResponse);

		} catch (Exception e) {
			logger.error("Error fetching projects for company_id: {}", company_id, e);
			apiResponse.setResponseCode("500");
			apiResponse.setResponseMessage("Please Contact Admin...");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
		}
	}
	
	@PostMapping("/timesheet/submit")
	public ResponseEntity<ApiResponse<List<TimesheetDTO>>> postTimesheet(@Validated @RequestBody List<TimesheetDTO> timesheetDTOList) {
		logger.info("Received request to submit {} timesheet entries", timesheetDTOList.size());

		ApiResponse<List<TimesheetDTO>> apiResponse = new ApiResponse<>();
		List<TimesheetDTO> successfulEntries = new ArrayList<>();
		List<TimesheetDTO> failedEntries = new ArrayList<>();

		try {
			if (timesheetDTOList == null || timesheetDTOList.isEmpty()) {
				logger.warn("Validation failed: Request body is empty.");
				apiResponse.setResponseCode("400");
				apiResponse.setResponseMessage("Request body should not be empty.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
			}

			for (TimesheetDTO timesheetdto : timesheetDTOList) {

				boolean isSaved = service_Interface.savetimesheetadd(timesheetdto);
				if (isSaved) {
					successfulEntries.add(timesheetdto);
				} else {
					failedEntries.add(timesheetdto);
				}

			}

			if (!failedEntries.isEmpty()) {
				logger.warn("Some Rows failed validation or Duplicates: {}", failedEntries);
				apiResponse.setResponseCode("207"); 
				apiResponse.setResponseMessage("Some timesheets were not processed due to validation errors.");
				apiResponse.setData(successfulEntries);
				return ResponseEntity.status(HttpStatus.MULTI_STATUS).body(apiResponse);
			}

			apiResponse.setResponseCode("201");
			apiResponse.setResponseMessage("All timesheets submitted successfully.");
			apiResponse.setData(successfulEntries);
			return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
		} catch (Exception e) {
			logger.error("Error while processing timesheet submissions", e);
			apiResponse.setResponseCode("500");
			apiResponse.setResponseMessage("Please Contact Admin...");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
		}
	}
	
	
	@DeleteMapping("/timesheet/rowdelete")
	public ResponseEntity<ApiResponse<TimesheetDTO>> deleteRowinTimeSheet(@Validated @RequestBody TimesheetDeleteDTO timesheetDeleteDTO) {
		logger.info("Received request to submit timesheet entries");
		ApiResponse<TimesheetDTO> apiResponse = new ApiResponse<>();
		try {
			if (timesheetDeleteDTO.getWorkId()==null) {
				logger.warn("Validation failed: Request body  work id is empty.");
				apiResponse.setResponseCode("400");
				apiResponse.setResponseMessage("Request body work id  should not be empty.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
			}
			String deleted=service_Interface.deleteWorkId(timesheetDeleteDTO);
			apiResponse.setResponseCode("200");
			apiResponse.setResponseMessage("WorkId in  timesheet deleted successfully "+deleted);
			apiResponse.setData(null);
			return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
		} catch (Exception e) {
			logger.error("Error while processing timesheet submissions", e);
			apiResponse.setResponseCode("500");
			apiResponse.setResponseMessage("Please Contact Admin...");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
		}
	}
	
	
	
	

	@GetMapping("timesheet/retrieve/{userId}")
	public ResponseEntity<ApiResponse<List<ReturnTodayDataDTO>>> retrieveAllToday(@PathVariable Integer userId) {
		logger.info("Retrieving timesheet data for userId: {}", userId);

		List<ReturnTodayDataDTO> todayData = service_Interface.gettodayData(userId);
		ApiResponse<List<ReturnTodayDataDTO>> apiResponse = new ApiResponse<>();

		if (todayData.isEmpty()) {
			apiResponse.setResponseCode("404");
			apiResponse.setResponseMessage("No timesheet records found for today.");
			apiResponse.setData(null);
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
		}

		apiResponse.setResponseCode("200");
		apiResponse.setResponseMessage("Timesheet records retrieved successfully.");
		apiResponse.setData(todayData);
		return ResponseEntity.ok(apiResponse);
	}
	

	@GetMapping("/today-data/{userId}")
	public ResponseEntity<ApiResponse<List<ReturnTodayDataDTO1>>> getTeamWorkDetails(@PathVariable Integer userId) {
		logger.info("Fetching work details for Employee ID: {}", userId);

		ApiResponse<List<ReturnTodayDataDTO1>> apiResponse = new ApiResponse<>();

		if (userId == null) {
			apiResponse.setResponseCode("400");
			apiResponse.setResponseMessage("User ID is required.");
			return ResponseEntity.badRequest().body(apiResponse);
		}

		List<ReturnTodayDataDTO1> teamWorkDetails = service_Interface.getTeamWorkDetails(userId);

		if (teamWorkDetails.isEmpty()) {
			apiResponse.setResponseCode("404");
			apiResponse.setResponseMessage("No work data found for the team today.");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
		}

		apiResponse.setResponseCode("200");
		apiResponse.setResponseMessage("Work details retrieved successfully.");
		apiResponse.setData(teamWorkDetails);

		return ResponseEntity.ok(apiResponse);
	}

	@Value("${employee.excel.filepath}")
	private String excelFilePath;
	@PostMapping("monthwise/excelgenerate")
	public ResponseEntity<?> generateExcel(@RequestBody MonthExcelMultipleDTO monthExcelDTO )throws IOException, InterruptedException{
		List<Integer> ids = monthExcelDTO.getEmployeeId();
		Integer month = monthExcelDTO.getMonth();
		Integer year = monthExcelDTO.getYear();

		if (month < 1 || month > 12) {
			throw new IllegalArgumentException("Invalid month number. Must be between 1 and 12.");
		}

		MonthEnum monthEnum = MonthEnum.values()[month - 1];
		String MonthName = monthEnum.name();

		

		File directory = new File(excelFilePath);
		if (!directory.exists()) {
			directory.mkdirs();
		}

		String fileName = "MonthData" + "-" + MonthName + "-" + year + System.currentTimeMillis() + ".xlsx";
		Thread.sleep(1000);
		Path path = Paths.get(excelFilePath + fileName);
		logger.info("Checking file existence at: {}", path.toAbsolutePath());
		boolean excelGenerate=service_Interface.generateExcelService( ids, month, year, fileName);


		if(!Files.exists(path)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("path not exist");
		}
		InputStreamResource resource=new InputStreamResource(Files.newInputStream(path));
		return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM).
				header(HttpHeaders.CONTENT_DISPOSITION,"attachment: filename=abc.xlsx")
				.body(resource);


	}

	@PostMapping("/teamlead/acceptance")
	public ResponseEntity<ApiResponse<TeamLeadAcceptanceDTO>> teamLeadResponse(
			@Validated @RequestBody List<TeamLeadAcceptanceDTO> teamLeadAcceptance) {

		logger.info("Received request for team lead acceptance: {}", teamLeadAcceptance);

		ApiResponse<TeamLeadAcceptanceDTO> apiResponse = new ApiResponse<>();

		try {
			// Validate request body
			if (teamLeadAcceptance == null) {
				logger.warn("Validation failed: Request body is empty.");
				apiResponse.setResponseCode("400");
				apiResponse.setResponseMessage("Request body should not be empty.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
			}
			boolean isSaved = service_Interface.auditTableSave(teamLeadAcceptance);

			if (isSaved) {
				logger.info("Team lead acceptance successfully recorded ");
				apiResponse.setResponseCode("201");
				apiResponse.setResponseMessage("Team lead acceptance submitted successfully.");
				apiResponse.setData(teamLeadAcceptance);
				return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
			} else {
				logger.warn("Failed to process team lead acceptance");
				apiResponse.setResponseCode("400");
				apiResponse.setResponseMessage("Failed to process the request. Please check input values.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
			}
		} catch (Exception e) {
			logger.error("Error while processing team lead acceptance request", e);
			apiResponse.setResponseCode("500");
			apiResponse.setResponseMessage("Please Contact Admin...");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
		}
	}	
	
	

	@PostMapping("/teamlead/reject")
	public ResponseEntity<ApiResponse<TeamLeadAcceptanceDTO>> teamLeadReject(
			@Validated @RequestBody TeamLeadAcceptanceDTO teamLeadAcceptance) {

		logger.info("Received request for team lead acceptance: {}", teamLeadAcceptance);

		ApiResponse<TeamLeadAcceptanceDTO> apiResponse = new ApiResponse<>();

		try {
			// Validate request body
			if (teamLeadAcceptance == null) {
				logger.warn("Validation failed: Request body is empty.");
				apiResponse.setResponseCode("400");
				apiResponse.setResponseMessage("Request body should not be empty.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
			}
			boolean isSaved = service_Interface.auditTableSaveReject(teamLeadAcceptance);

			if (isSaved) {
				logger.info("Team lead Rejection successfully recorded ");
				apiResponse.setResponseCode("201");
				apiResponse.setResponseMessage("Team lead Rejection submitted successfully.");
				apiResponse.setData(teamLeadAcceptance);
				return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
			} else {
				logger.warn("Failed to process team lead Rejection");
				apiResponse.setResponseCode("400");
				apiResponse.setResponseMessage("Failed to process the request. Please check input values.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
			}
		} catch (Exception e) {
			logger.error("Error while processing team lead Rejection request", e);
			apiResponse.setResponseCode("500");
			apiResponse.setResponseMessage("Please Contact Admin...");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
		}
	}
	
	@GetMapping("retrieve/team/{userId}")
	public ResponseEntity<?> retrieveTeam(@PathVariable Integer userId) {
		logger.info("Retrieving team members for userId: {}", userId);
		TeamLeadDataEmployeeAsWell teamLeadDataEmployeeAsWell= new TeamLeadDataEmployeeAsWell();
		try {
			List<Integer> teamleads = service_Interface.getTeamLeadList(userId);

			if (teamleads.isEmpty()) {
				ApiResponse apiResponse = new ApiResponse();
				apiResponse.setData(teamLeadDataEmployeeAsWell);
				apiResponse.setResponseCode("404");
				apiResponse.setResponseMessage("Bad Request");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
			}

			// Remove duplicates and filter out the current user
			Set<Integer> uniqueNumbers = new HashSet<>(teamleads);

			List<Integer> teamLeadList = uniqueNumbers.stream()
					.filter(num -> !num.equals(userId)) // Ensure num != userId
					.collect(Collectors.toList());

			System.out.println("team lead 1 :"+teamLeadList);
			List<MonthDataDuration> teamLeadAlone =new ArrayList<MonthDataDuration>(); 
			teamLeadAlone.addAll(service_Interface.getTeamLeadtask(teamLeadList));
			//System.out.println("Teamlead 2 :"+teamleademployee);
//			if (teamleademployee.isEmpty()) {
//				teamLeadDataEmployeeAsWell.setTeamLead(teamLeadAlone);
//				teamLeadDataEmployeeAsWell.setTeamMemeber(null);
//				ApiResponse apiResponse = new ApiResponse();
//				apiResponse.setData(teamLeadDataEmployeeAsWell);
//				apiResponse.setResponseCode("200");
//				apiResponse.setResponseMessage("Success");
//				return ResponseEntity.ok(apiResponse);
//			} else {
				Set<Integer> uniqueEmployeeNumbers = new HashSet<>(teamLeadList);
//				List<Integer> employeeIds = new ArrayList<>(uniqueEmployeeNumbers);
				//System.out.println("team meamber data from else :"+employeeIds);
				List<MonthDataDuration> teamMember =new ArrayList<MonthDataDuration>();
				teamMember.addAll(service_Interface.getTeamLeadtaskfinal(teamLeadList));
				teamLeadDataEmployeeAsWell.setTeamLead(teamLeadAlone);
				teamLeadDataEmployeeAsWell.setTeamMemeber(teamMember);
				ApiResponse apiResponse = new ApiResponse();
				apiResponse.setData(teamLeadDataEmployeeAsWell);
				apiResponse.setResponseCode("200");
				apiResponse.setResponseMessage("Success");
				return ResponseEntity.ok(apiResponse);
//			}
		} catch (Exception e) {
			logger.error("Error retrieving team members for userId: {}", userId, e);
			ApiResponse errorResponse = new ApiResponse();
			errorResponse.setResponseCode("500");
			errorResponse.setResponseMessage("An error occurred while retrieving team members.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	@PostMapping("/retriveData/monthWise")
	public ResponseEntity<?> getAllEmployeeByMonth(@RequestBody MonthExcelDTO monthDataDto) {
		logger.info("Retrieving monthly data for user ID: {}", monthDataDto.getEmployeeId());

		try {
			List<MonthlyDataDTO> monthlyDataDto = service_Interface.getAllData(monthDataDto);
			List<MonthDataDuration> controllerMonthdata = service_Interface.extractData(monthlyDataDto, monthDataDto.getEmployeeId());

			ApiResponse apiResponse = new ApiResponse();
			apiResponse.setData(controllerMonthdata);
			apiResponse.setResponseCode("200");
			apiResponse.setResponseMessage("Success");

			return ResponseEntity.ok(apiResponse);
		} catch (Exception e) {
			logger.error("Error retrieving monthly data for user ID: {}", monthDataDto.getEmployeeId(), e);

			ApiResponse errorResponse = new ApiResponse();
			errorResponse.setResponseCode("500");
			errorResponse.setResponseMessage("An error occurred while retrieving monthly data.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	@PostMapping("/entity/productionhours")
	public ResponseEntity<?> getProductionHoursByMonth(@RequestBody EntityProductionHours entityProductionHours) {
		logger.info("Retrieving monthly data for Entitywise");

		Integer id = entityProductionHours.getRoleId();
		Integer month = entityProductionHours.getMonth();
		Integer year = entityProductionHours.getYear();

		try {
			if (month < 1 || month > 12) {
				return ResponseEntity.badRequest().body("Invalid month number. Must be between 1 and 12.");
			}

			if (id <= 2) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN)
						.body("For this role id, cannot generate Production Hours data.");
			}

			MonthEnum monthEnum = MonthEnum.values()[month - 1];
			String monthName = monthEnum.name();

			File directory = new File(excelFilePath);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			String fileName = "ProductionHours-" + monthName + "-" + year + "-" + System.currentTimeMillis() + ".xlsx";
			Path path = Paths.get(excelFilePath, fileName);

			boolean excelGenerated = service_Interface.generateExcelProductionHour(id, month, year, fileName);
			if (!excelGenerated || !Files.exists(path)) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body("Failed to generate Excel file.");
			}

			InputStreamResource resource = new InputStreamResource(Files.newInputStream(path));

			return ResponseEntity.ok()
					.contentType(MediaType.APPLICATION_OCTET_STREAM)
					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
					.body(resource);

		} catch (Exception e) {
			logger.error("Error during Excel generation", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error occurred while generating the Excel: " + e.getMessage());
		}
	}


	@PostMapping("/entity/projectwise/employee")
	public ResponseEntity<?> getProjectWiseEmployee(@RequestBody ProjectWiseEmployee projectWiseEmployee) {
		logger.info("Retrieving monthly data for project wise");

		Integer id = projectWiseEmployee.getProjectId();
		Integer month = projectWiseEmployee.getMonth();
		Integer year = projectWiseEmployee.getYear();

		try {
			if (month < 1 || month > 12) {
				return ResponseEntity.badRequest().body("Invalid month number. Must be between 1 and 12.");
			}
			if (id <= 1) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN)
						.body("For this role id, cannot generate Production Hours data.");
			}



			MonthEnum monthEnum = MonthEnum.values()[month - 1];
			String monthName = monthEnum.name();

			File directory = new File(excelFilePath);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			String fileName = "ProjectwiseEmployee-" + monthName + "-" + year + "-" + System.currentTimeMillis() + ".xlsx";
			Path path = Paths.get(excelFilePath, fileName);

			boolean excelGenerated = service_Interface.generateExcelProjectWiseEmployee(id, month, year, fileName);
			if (!excelGenerated || !Files.exists(path)) {
				return ResponseEntity.status(HttpStatus.NO_CONTENT)
						.body("Failed to generate Excel file.");
			}

			InputStreamResource resource = new InputStreamResource(Files.newInputStream(path));

			return ResponseEntity.ok()
					.contentType(MediaType.APPLICATION_OCTET_STREAM)
					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
					.body(resource);

		} catch (Exception e) {
			logger.error("Error during Excel generation", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error occurred while generating the Excel: " + e.getMessage());
		}
	}


	@PostMapping("/retriveData/monthWiseAll")
	public ResponseEntity<?> getAllEmployeeByMonthAll(@RequestBody MonthExcelDTO monthDataDto) {
		logger.info("Retrieving monthly data for user ID: {}", monthDataDto.getEmployeeId());

		try {
			List<Integer> teamAllData=service_Interface.getAllDataTeamlead(monthDataDto.getEmployeeId());
			System.out.println("data employee"+teamAllData.toString());
			List<MonthlyDataDTO> monthlyDataDto = service_Interface.getAllDataAll(monthDataDto);
			
			List<MonthDataDuration> controllerMonthdata = service_Interface.extractDataAll(monthlyDataDto, teamAllData);

			ApiResponse apiResponse = new ApiResponse();
			apiResponse.setData(controllerMonthdata);
			apiResponse.setResponseCode("200");
			apiResponse.setResponseMessage("Success");

			return ResponseEntity.ok(apiResponse);
		} catch (Exception e) {
			logger.error("Error retrieving monthly data for user ID: {}", monthDataDto.getEmployeeId(), e);

			ApiResponse errorResponse = new ApiResponse();
			errorResponse.setResponseCode("500");
			errorResponse.setResponseMessage("An error occurred while retrieving monthly data.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	@GetMapping("/entity/projects/{employeeId}")
	public ResponseEntity<ApiResponse<List<EntityProjectsDTO>>> getProjects(@PathVariable Integer employeeId) {
		logger.info("Received request to fetch projects for employeeId: {}", employeeId);
		ApiResponse<List<EntityProjectsDTO>> apiResponse = new ApiResponse<>();
		try {
			List<EntityProjectsDTO> projectList = service_Interface.getProjectForExcel(employeeId);
			logger.debug("Fetched {} projects for employeeId: {}", 
					projectList != null ? projectList.size() : 0, employeeId);

			if (projectList == null || projectList.isEmpty()) {
				logger.warn("No projects found for employeeId: {}", employeeId);
				apiResponse.setResponseCode("404");
				apiResponse.setResponseMessage("No Projects Found for this ID: " + employeeId);
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
			}

			apiResponse.setResponseCode("200");
			apiResponse.setResponseMessage("Projects Retrieved Successfully");
			apiResponse.setData(projectList);
			logger.info("Returning {} projects for employeeId: {}", projectList.size(), employeeId);
			return ResponseEntity.ok(apiResponse);

		} catch (Exception e) {
			logger.error("Error fetching projects for employeeId: {}", employeeId, e);
			apiResponse.setResponseCode("500");
			apiResponse.setResponseMessage("Please Contact Admin...");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
		}
	}
	
	@PostMapping("/entity/modify/history")
	public ResponseEntity<ApiResponse<List<HistoryDto>>> modifyHistory(@RequestBody DateFormatDto dateformat) {
	    logger.info("Received request to fetch modified work history by TL (Team Lead): {}", dateformat.getUserId());
	    
	    ApiResponse<List<HistoryDto>> apiResponse = new ApiResponse<>();

	    try {
	        // Call service to fetch history
	        List<HistoryDto> historyList = service_Interface.getModifyHistory(dateformat);

	        if (historyList.isEmpty()) {
	            logger.warn("No modified work history found for Team Lead ID: {}", dateformat.getUserId());
	            apiResponse.setResponseCode("204");
	            apiResponse.setResponseMessage("No history records found for given input.");
	            apiResponse.setData(Collections.emptyList());
	            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
	        }

	        // Success response
	        logger.info("Modified work history retrieved successfully. Records found: {}", historyList.size());
	        apiResponse.setResponseCode("200");
	        apiResponse.setResponseMessage("History retrieved successfully");
	        apiResponse.setData(historyList);
	        return ResponseEntity.ok(apiResponse);

	    } catch (RuntimeException e) {
	        logger.error("Validation error: {}", e.getMessage());
	        apiResponse.setResponseCode("400");
	        apiResponse.setResponseMessage(e.getMessage());
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);

	    } catch (Exception e) {
	        logger.error("Unexpected error while fetching history for Team Lead ID: {}", dateformat.getUserId(), e);
	        apiResponse.setResponseCode("500");
	        apiResponse.setResponseMessage("Something went wrong. Please contact admin.");
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
	    }
	}


}



//	@PostMapping("/timesheet/add")
//	public ResponseEntity<ApiResponse> PostTimesheetadd(@Validated @RequestBody TimesheetDTO timesheetdto) {
//		 logger.info("Received request to add a timesheet entry: {}", timesheetdto);
//
//		    ApiResponse<TimesheetDTO> apiResponse = new ApiResponse<>();
//		    if (timesheetdto.getTodayDate() == null ||     
//		        timesheetdto.getUserId() == null || 
//		        timesheetdto.getProjectId() == null || 
//		        timesheetdto.getTechnologyId() == null || 
//		        timesheetdto.getDescription() == null || 
//		        timesheetdto.getDuration() == null) {
//		        
//		        logger.warn("Validation failed: Missing required fields for SerialNumber: {}", timesheetdto.getSerialNumber());
//		        apiResponse.setResponseCode("400");
//		        apiResponse.setResponseMessage("Missing required fields for SerialNumber: " + timesheetdto.getSerialNumber());
//		        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
//		    }
//
//		    try {
//		    	boolean submit=false;
//		        boolean statusAdded = service_Interface.savetimesheetadd(timesheetdto,submit);
//
//		        if (statusAdded) {
//		            apiResponse.setResponseCode("201");
//		            apiResponse.setResponseMessage("Timesheet entry added successfully");
//		            apiResponse.setData(timesheetdto);
//		            logger.info("Timesheet added successfully for SerialNumber: {}", timesheetdto.getSerialNumber());
//		            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
//		        } else {
//		            logger.warn("Failed to add timesheet for SerialNumber: {}", timesheetdto.getSerialNumber());
//		            apiResponse.setResponseCode("500");
//		            apiResponse.setResponseMessage("Failed to save timesheet. Please try again.");
//		            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
//		        }
//
//		    } catch (Exception e) {
//		        logger.error("Error while adding timesheet for SerialNumber: {}", timesheetdto.getSerialNumber(), e);
//		        apiResponse.setResponseCode("500");
//		        apiResponse.setResponseMessage("Please Contact Admin...");
//		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
//		    }
//		}
//@DeleteMapping("/timesheet/rowdelete")
//public ResponseEntity<ApiResponse<?>> flagChange(@Validated @RequestBody TimesheetDTO timesheetdto) {
//    logger.info("Received request to flag change for Timesheet ID: {}", timesheetdto.getSerialNumber());
//    ApiResponse<?> apiResponse = new ApiResponse<>();
//    try {
//        boolean isDeleted = service_Interface.flagchange(timesheetdto);
//
//        if (isDeleted) {
//            logger.info("Flag change successful for Timesheet ID: {}", timesheetdto.getSerialNumber());
//            apiResponse.setResponseCode("200");
//            apiResponse.setResponseMessage("Deleted Successfully");
//            return ResponseEntity.ok(apiResponse);
//        } else {
//            logger.warn("Flag change failed: Record Not Found for Timesheet ID: {}", timesheetdto.getSerialNumber());
//            apiResponse.setResponseCode("404");
//            apiResponse.setResponseMessage("Record Not Found");
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
//        }
//    } catch (Exception e) {
//        logger.error("Error while changing flag for Timesheet ID: {}", timesheetdto.getSerialNumber(), e);
//        apiResponse.setResponseCode("500");
//        apiResponse.setResponseMessage("Please Contact Admin...");
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
//    }
//}