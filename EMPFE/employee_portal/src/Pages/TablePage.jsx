import React, { useState } from "react";
import "./TablePage.css";

export const TablePage = () => {
  const [roleCode, setRoleCode] = useState("");
  const [roleName, setRoleName] = useState("");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isModelOpenEdit, setIsModelOpenEdit] = useState(false);
  const [roleData, setRoleData] = useState({
    roleCode: "",
    roleName: "",
    IsActive: true,
  });
  const [editRoleData, setEditRoleData] = useState({
    id: "",
    roleCode: "",
    roleName: "",
    IsActive: true,
    operation: "Edit",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const roles = [
    { id: 1, roleCode: "ADMIN", roleName: "Administrator", status: "Active" },
    { id: 2, roleCode: "EMP", roleName: "Employee", status: "Inactive" },
    { id: 3, roleCode: "HR", roleName: "HR Manager", status: "Active" },
    { id: 4, roleCode: "MAN", roleName: "Manager", status: "Active" },
    { id: 5, roleCode: "DEV", roleName: "Developer", status: "Active" },
    { id: 6, roleCode: "ACC", roleName: "Accountant", status: "Inactive" },
    { id: 7, roleCode: "SUP", roleName: "Support", status: "Active" },
    { id: 8, roleCode: "QA", roleName: "Quality Analyst", status: "Active" },
    { id: 9, roleCode: "ENG", roleName: "Engineer", status: "Active" },
    { id: 10, roleCode: "TEST", roleName: "Tester", status: "Inactive" },
    {
      id: 11,
      roleCode: "ADMIN2",
      roleName: "Administrator 2",
      status: "Active",
    },
    { id: 12, roleCode: "EMP2", roleName: "Employee 2", status: "Inactive" },
  ];

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = roles.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(roles.length / recordsPerPage);

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search Values:", { roleCode, roleName });
  };

  const handleClear = () => {
    setRoleCode("");
    setRoleName("");
  };

  const handleAddRecord = () => {
    setRoleData({ roleCode: "", roleName: "", IsActive: true });
    setIsModelOpen(true);
  };

  const handleEditRecord = (operationType) => {
    if (selectedRoleIndex === null) return; // Safety check

    setEditRoleData((prev) => ({
      ...roles[selectedRoleIndex], // Load selected role's data
      operation: operationType,
    }));
    setIsModelOpenEdit(true);
  };

  const handleRoleData = (e) => {
    setRoleData({ ...roleData, [e.target.name]: e.target.value });
  };

  const handleEditRoleData = (e) => {
    setEditRoleData({ ...editRoleData, [e.target.name]: e.target.value });
  };

  return (
    <div className="containers">
      {/* Search Form */}
      <label>
        <h2>Master Employee Role Table</h2>
      </label>
      <form className="search_box" onSubmit={handleSearch}>
        <label>
          <h3>Search Employee Role</h3>
        </label>
        <div className="row1">
          <div className="box">
            <label>Role Code :</label>
            <input
              type="text"
              name="roleCode"
              value={roleCode}
              onChange={(e) => setRoleCode(e.target.value)}
              placeholder="Admin"
            />
          </div>
          <div className="box">
            <label>Role Name : </label>
            <input
              type="text"
              name="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Administrator"
            />
          </div>
        </div>
        <div className="row2 button">
          <button type="submit" className="search">
            Search
          </button>
          <button type="button" className="clear" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>
      <div className="curd">
        <button type="button" className="addRole" onClick={handleAddRecord}>
          Add Role
        </button>
        <button
          type="button "
          className="Edit"
          onClick={() => handleEditRecord("Edit")}
        >
          Edit
        </button>
        <button type="button" className="View">
          View
        </button>
        <button
          type="button"
          className="Delete"
          onClick={() => handleEditRecord("Delete")}
        >
          Delete
        </button>
      </div>

      {/* Table Section */}
      <table className="table">
        <thead>
          <tr>
            <th>Select Role</th>
            <th>S.No</th>
            <th>Role Code</th>
            <th>Role Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((role, index) => (
            <tr key={`${role.id}-${index}`}>
              <td>
                <input
                  type="radio"
                  name="editRole"
                  value={role.id}
                  onChange={() => setEditRoleData(role)}
                />
              </td>

              <td>{indexOfFirstRecord + index + 1}</td>
              <td>{role.roleCode}</td>
              <td>{role.roleName}</td>
              <td>{role.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-controls">
        <div>
          <label>Rows per page: </label>
          <select
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(parseInt(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="pagination-buttons">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {isModelOpen && (
        <div className="model">
          <div className="model-content">
            <span className="close" onClick={() => setIsModelOpen(false)}>
              &times;
            </span>
            <h2>Add Role</h2>
            <div className="input-group">
              <label>Role Code</label>
              <input
                name="roleCode"
                value={roleData.roleCode}
                onChange={handleRoleData}
              />
            </div>
            <div className="input-group">
              <label>Role Name</label>
              <input
                name="roleName"
                value={roleData.roleName}
                onChange={handleRoleData}
              />
            </div>

            <button
              className="btn green"
              onClick={() => {
                console.log("Create Role:", editRoleData);
                setIsModelOpen(false); // Close modal after operation
              }}
            >
              Create Role{" "}
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isModelOpenEdit && (
        <div className="model">
          <div className="model-content">
            <span className="close" onClick={() => setIsModelOpenEdit(false)}>
              &times;
            </span>

            <h2>
              {editRoleData.operation === "Edit"
                ? `Edit Role: `
                : `Delete Role : `}
            </h2>

            {editRoleData.operation === "Edit" ? (
              <>
                <div className="input-group">
                  <label>Role Code</label>
                  <input
                    name="roleCode"
                    value={editRoleData.roleCode}
                    onChange={handleEditRoleData}
                    placeholder="Enter Role Code"
                  />
                </div>
                <div className="input-group">
                  <label>Role Name</label>
                  <input
                    name="roleName"
                    value={editRoleData.roleName}
                    onChange={handleEditRoleData}
                    placeholder="Enter Role Name"
                  />
                </div>
                <button
                  className="btn green"
                  onClick={() => {
                    console.log("Updated Role:", editRoleData);
                    setIsModelOpenEdit(false); // Close modal after operation
                  }}
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <div className="delete">
                  <p>
                    Are you sure you want to delete role{" "}
                    <b>{editRoleData.roleName}</b> (Code:{" "}
                    {editRoleData.roleCode})?
                  </p>
                  <div className="delBtn">
                    <button
                      className="btn red"
                      onClick={() => {
                        console.log("Deleting Role:", editRoleData);
                        setIsModelOpenEdit(false); // Close modal after operation
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className="btn green"
                      onClick={() => {
                        console.log("Deleting Role:", editRoleData);
                        setIsModelOpenEdit(false); // Close modal after operation
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
