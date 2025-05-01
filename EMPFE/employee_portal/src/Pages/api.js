import axios from "axios";

const API_BASE_URL = "http://localhost:8081/employee";

const TIMESHEET_URI = "http://localhost:8081/bseciagami/api/employee";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};
export const getEntities = async () => {
  // console.log("🔐 Auth Header:", getAuthHeader());
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(`${TIMESHEET_URI}/entity`, {
      headers: getAuthHeader(),
    });
    // console.log("Entity request : ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return null;
  }
};
export const getProjects = async (id) => {
  try {
    const response = await axios.get(`${TIMESHEET_URI}/entity/${id}`, {
      headers: getAuthHeader(),
    });
    console.log("Projects : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating role:", error);
    return null;
  }
};
export const getTech = async (id) => {
  try {
    const response = await axios.get(
      `${TIMESHEET_URI}/entityid/technology/${id}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating role:", error);
    return null;
  }
};

export const getTaskupdates = async (id) => {
  try {
    const response = await axios.get(
      `${TIMESHEET_URI}/timesheet/retrieve/${id}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating role:", error);
    return null;
  }
};

export const postResponse = async (responseData) => {
  try {
    // ✅ Check if the array has data
    if (!responseData || responseData.length === 0) {
      console.error("❌ Error: Trying to submit an empty timesheet!");
      return null;
    }

    console.log("🚀 Submitting Data:", JSON.stringify(responseData, null, 2));

    const response = await axios.post(
      `${TIMESHEET_URI}/timesheet/submit`,
      responseData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeader(),
        },
      }
    );

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return null;
  }
};

export const getCredintial = async (credData) => {
  try {
    console.log("📤 Sending Payload:", credData);
    const response = await axios.post(`${TIMESHEET_URI}/signin`, credData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ Server Error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      return error.response.data;
    } else if (error.request) {
      console.error("❌ No Response:", error.request);
    } else {
      console.error("❌ Unknown Error:", error.message);
    }
    return null;
  }
};
export const updateCredintial = async (credData) => {
  try {
    console.log("📤 Sending Payload:", credData);
    const response = await axios.put(`${TIMESHEET_URI}/updateUser`, credData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    console.log("Updating pass");
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ Server Error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error("❌ No Response:", error.request);
    } else {
      console.error("❌ Unknown Error:", error.message);
    }
    return null;
  }
};

export const postDownload = async (request) => {
  console.log("🔐 Headers: ", {
    "Content-Type": "application/json",
    Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ...getAuthHeader(),
  });

  console.log("Request body : ", request);

  try {
    // Sending headers correctly in the axios config
    const response = await axios.post(
      `${TIMESHEET_URI}/monthwise/excelgenerate`,
      // Request body should be passed here as data
      request,
      {
        headers: {
          "Content-Type": "application/json",
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ...getAuthHeader(), // Authorization header is merged here
        },
        responseType: "blob", // Expect binary data for the Excel file
      }
    );

    console.log("✅ API Response:", response);
    console.log("🧐 Response Data Type:", typeof response.data);
    console.log("🧐 Response Data:", response.data);

    if (!response.data) {
      console.error("❌ No data received!");
      return;
    }

    // Convert to Blob
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Debugging: Check Blob Size
    console.log("📝 Blob Size:", blob.size);

    // Create Download Link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "MonthlyTimesheet.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    console.log("✅ File downloaded successfully!");
  } catch (error) {
    console.error("❌ Download Error:", error);
  }
};
export const postDownloadProjectReport = async (request) => {
  console.log("🔐 Headers: ", {
    "Content-Type": "application/json",
    Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ...getAuthHeader(),
  });

  console.log("Request body : ", request);

  try {
    // Sending headers correctly in the axios config
    const response = await axios.post(
      `${TIMESHEET_URI}/entity/projectwise/employee`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ...getAuthHeader(), // Authorization header is merged here
        },
        responseType: "blob", // Expect binary data for the Excel file
      }
    );

    console.log("✅ API Response:", response);
    console.log("🧐 Response Data Type:", typeof response.data);
    console.log("🧐 Response Data:", response.data);

    if (!response.data) {
      console.error("❌ No data received!");
      return;
    }

    // Convert to Blob
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Debugging: Check Blob Size
    console.log("📝 Blob Size:", blob.size);

    // Create Download Link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "MonthlyTimesheet.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    console.log("✅ File downloaded successfully!");
  } catch (error) {
    console.error("❌ Download Error:", error);
  }
};
export const postDownloadProductionHours = async (request) => {
  console.log("🔐 Headers: ", {
    "Content-Type": "application/json",
    Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ...getAuthHeader(),
  });

  console.log("Request body : ", request);

  try {
    // Sending headers correctly in the axios config
    const response = await axios.post(
      `${TIMESHEET_URI}/entity/productionhours`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ...getAuthHeader(), // Authorization header is merged here
        },
        responseType: "blob", // Expect binary data for the Excel file
      }
    );

    console.log("✅ API Response:", response);
    console.log("🧐 Response Data Type:", typeof response.data);
    console.log("🧐 Response Data:", response.data);

    if (!response.data) {
      console.error("❌ No data received!");
      return;
    }

    // Convert to Blob
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Debugging: Check Blob Size
    console.log("📝 Blob Size:", blob.size);

    // Create Download Link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "MonthlyTimesheet.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    console.log("✅ File downloaded successfully!");
  } catch (error) {
    console.error("❌ Download Error:", error);
  }
};

export const getTotalWorkingHours = async (workingHoursList) => {
  console.log("🚀 Sending Payload:", workingHoursList);
  console.log("Header : ", getAuthHeader());
  try {
    const response = await axios.post(
      `${TIMESHEET_URI}/totalWorkingHours`,
      workingHoursList,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeader(),
        },
      }
    );

    console.log("✅ API Response Total Working Hours:", response.data);
    return response.data.data; // Returning the response
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return null;
  }
};

export const getMonthReport = async (responseData) => {
  try {
    // ✅ Check if the array has data
    if (!responseData || responseData.length === 0) {
      console.error("❌ Error: Trying to submit an empty timesheet!");
      return null;
    }

    // console.log("🚀 Submitting Data:", JSON.stringify(responseData, null, 2));

    const response = await axios.post(
      `${TIMESHEET_URI}/retriveData/monthWise`,
      responseData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeader(),
        },
      }
    );

    // console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return null;
  }
};

export const getTeamReport = async (UId) => {
  try {
    const response = await axios.get(`${TIMESHEET_URI}/retrieve/team/${UId}`, {
      headers: getAuthHeader(),
    });

    console.log("✅ API Response Team:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return null;
  }
};


export const historyData = async (req) => {
  try {
    const response = await axios.post(
      `${TIMESHEET_URI}/entity/modify/history`,
     req,
      {
        headers: getAuthHeader(),
      }
    );

    console.log("✅ API Response Team:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return null;
  }
};


export const updateWorkStatus = async (responseData) => {
  try {
    // ✅ Check if the array has data
    if (!responseData || responseData.length === 0) {
      console.error("❌ Error: Trying to submit an empty timesheet!");
      return null;
    }

    console.log("🚀 Submitting Data:", JSON.stringify(responseData, null, 2));

    const response = await axios.post(
      `${TIMESHEET_URI}/teamlead/acceptance`,
      responseData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeader(),
        },
      }
    );

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return null;
  }
};
export const updateWorkReject = async (responseData) => {
  try {
    // ✅ Check if the array has data
    if (!responseData || responseData.length === 0) {
      console.error("❌ Error: Trying to reject an empty timesheet!");
      return null;
    }

    console.log("🚀 Submitting Data:", JSON.stringify(responseData, null, 2));

    const response = await axios.post(
      `${TIMESHEET_URI}/teamlead/reject`,
      responseData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeader(),
        },
      }
    );

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return null;
  }
};
// Get all Employees
///retrieve/teamonly/2

export const getTeamMembers = async (responseData) => {
  try {
    // ✅ Check if the array has data
    if (!responseData || responseData.length === 0) {
      console.error("❌ Error: Trying to reject an empty timesheet!");
      return null;
    }

    console.log("🚀 Submitting Data:", JSON.stringify(responseData, null, 2));

    const response = await axios.post(
      `${TIMESHEET_URI}/teamlead/reject`,
      responseData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeader(),
        },
      }
    );

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return null;
  }
};
export const deleteRow = async (responseData) => {
  try {
    console.log("🚀 Deleting row:", JSON.stringify(responseData, null, 2));

    const response = await axios.delete(
      `${TIMESHEET_URI}/timesheet/rowdelete`,
      {
        data: responseData,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeader(),
        },
      }
    );

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return null;
  }
};

export const getEmployees = async (id) => {
  try {
    const response = await axios.get(
      `${TIMESHEET_URI}/company/employees/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeader(),
        },
      }
    );
    console.log("Emp : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    throw error; // Optional: rethrow if you want the caller to handle it
  }
};
export const getProjectForDownload = async (id) => {
  try {
    const response = await axios.get(`${TIMESHEET_URI}/entity/projects/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAuthHeader(),
      },
    });
    console.log("ProJ : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Project :", error);
    throw error; // Optional: rethrow if you want the caller to handle it
  }
};

export const getAllRoles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/roles/retrieveAll`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return null;
  }
};
export const createRole = async (roleData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/roles/createRole`,
      roleData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};
export const updateRole = async (id, roleData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/roles/updateRole/${id}`,
      roleData
    );
    return response;
  } catch (error) {
    console.error("Error updating role:", error);
    return null;
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/roles/deleteById/${id}`
    );
    console.log("Api Response : ", response);
    console.log("Api Response : ", response.data);
    return response;
  } catch (error) {
    console.log("Error occuring on delete: ", error);
    return null;
  }
};
export const searchRoles = async (roleCode, roleName) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/roles/search`, {
      roleCode: roleCode || "",
      roleName: roleName || "",
    });

    console.log("Search API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error searching roles:", error);

    if (error.response?.status === 400) {
      console.error("Bad Request: Make sure the request body is correct.");
    }

    return { data: [] };
  }
};
