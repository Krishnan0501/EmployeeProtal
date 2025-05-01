import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { getEntities, getProjects, getTech } from "../../Pages/api.js";

// ✅ Styled Table Row (Zebra Stripes)
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: "#e0f7fa",
    cursor: "pointer",
  },
}));

// ✅ Styled Table Header Cell (Purple Header)
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#842988",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "center",
  },
}));

export const TimesheetSelection = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [entity, setEntity] = useState("");
  const [entities, setEntities] = useState([]);
  const [entityId, setEntityId] = useState();
  const [project, setProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState();
  const [technology, setTechnology] = useState("");
  const [technologies, setTechnologies] = useState([]);
  const [technologyId, setTechnologyId] = useState("");
  const [duration, setDuration] = useState("");
  const [details, setDetails] = useState("");
  const [entriesName, setEntriesName] = useState([
    {
      entityName: "",
      projectName: "",
      technologyName: "",
      details: "",
      duration: "",
      isEditing: true,
    },
  ]);
  const [entries, setEntries] = useState([
    {
      entity: "",
      project: "",
      technology: "",
      details: "",
      duration: "",
      isEditing: true,
    },
  ]);

  const [totalHours, setTotalHours] = useState(0);
  const fetchEntity = async () => {
    try {
      const data = await getEntities();
      setEntities(data.data);

      console.log("Entities : ", entities);
      console.log("Fetched roles:", data.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };
  const fetchProjects = async (id) => {
    try {
      const data = await getProjects(id);
      setProjects(data.data);

      console.log("Entities : ", entities);
      console.log("Fetched projects:", data.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };
  const fetchTech = async (id) => {
    try {
      const data = await getTech(id);
      setTechnologies(data.data);

      console.log("Fetched projects:", data.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchEntity();
  }, []);
  useEffect(() => {
    console.log("Entities after update: ", entities);
  }, [entities]); // This triggers every time entities is updated
  useEffect(() => {
    if (entities.length === 0) {
      console.warn("No entities found. Check API response.");
    }
  }, [entities]);
  useEffect(() => {
    console.log("entityId (state):", entityId);
    fetchProjects(entityId);
  }, [entityId]);

  useEffect(() => {
    console.log("ProID (state):", projectId);
    fetchTech(projectId);
  }, [projectId]);

  const isAddDisabled =
    !entity || !project || !technology || !duration || !details;

  const handleInputChange = (index, field, value, name) => {
    const updatedEntries = [...entries];
    updatedEntries[index][field] = value;
    if (field === "entity") {
      setEntityId(value);
      console.log("entityId : ", entityId);
    }
    if (field === "project") {
      setProjectId(value);
      console.log("ProjectId : ", projectId);
    }
    if (field === "technology") {
      setTechnologyId(value);
      console.log("technologyId : ", technologyId);
    }
    if (field === "duration") {
      const newTotal = updatedEntries.reduce(
        (sum, entry) => sum + (parseFloat(entry.duration) || 0),
        0
      );
      if (newTotal > 24) {
        alert("⚠️ Total hours cannot exceed 24 per day!");
        return;
      }
      setTotalHours(newTotal);
    }
    setEntries(updatedEntries);
  };

  const handleAdd = () => {
    const parsedDuration = parseFloat(duration);

    const newTotal = totalHours + parsedDuration;
    if (newTotal > 24) {
      alert(
        "⚠️ Time limit exceeded! The total cannot exceed 24 hours per day."
      );
      return;
    }

    const newEntry = {
      date,
      entity,
      project,
      technology,
      duration: parsedDuration.toFixed(1),
      details,
    };

    setEntries([...entries, newEntry]);
    setTotalHours(newTotal);

    setEntity("");
    setProject("");
    setTechnology("");
    setDuration("");
    setDetails("");
  };

  const handleClear = () => {
    setEntity("");
    setProject("");
    setTechnology("");
    setDuration("");
    setDetails("");
  };

  const handleDelete = (index) => {
    const deletedDuration = parseFloat(entries[index].duration);
    setTotalHours(totalHours - deletedDuration);
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (entries.length === 0) {
      alert("⚠️ No entries to submit!");
      return;
    }
    console.log("Entries: ", JSON.stringify(entries, null, 2));

    console.log("Submitting Timesheet:", entries);
    alert("✅ Timesheet submitted successfully!");
  };

  return (
    <div className="containers">
      <Typography variant="h5" sx={{ mt: 1, mb: 1 }} gutterBottom>
        Timesheet Entry
      </Typography>

      {/* FORM */}

      {/* ✅ DATA TABLE */}
      <Paper
        sx={{
          marginTop: 2,
          padding: 0,
          borderRadius: "10px 10px 0 0",
          overflow: "hidden",
        }}
      >
        <TableContainer sx={{ maxHeight: "50vh", overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell sx={{ width: "5%", textAlign: "center" }}>
                  S.No
                </StyledTableCell>
                <StyledTableCell sx={{ width: "10%" }}>Entity</StyledTableCell>
                <StyledTableCell sx={{ width: "15%" }}>Project</StyledTableCell>
                <StyledTableCell sx={{ width: "20%" }}>
                  Technology
                </StyledTableCell>
                <StyledTableCell sx={{ width: "34%" }}>Details</StyledTableCell>
                <StyledTableCell sx={{ width: "8%", textAlign: "center" }}>
                  Duration (hrs)
                </StyledTableCell>
                <StyledTableCell sx={{ width: "8%", textAlign: "center" }}>
                  Action
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell sx={{ width: "40px", textAlign: "center" }}>
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      select
                      size="small"
                      value={entry.entity || ""}
                      onChange={(e) =>
                        handleInputChange(index, "entity", e.target.value)
                      }
                      sx={{
                        width: "150px",
                      }}
                    >
                      {entities.length > 0 ? (
                        entities.map((option) => (
                          <MenuItem
                            key={option.companyCode}
                            value={option.companyCode}
                          >
                            {option.companyName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No Entities Found</MenuItem>
                      )}
                    </TextField>
                  </StyledTableCell>

                  <StyledTableCell>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      value={entry.project || ""}
                      onChange={(e) =>
                        handleInputChange(index, "project", e.target.value)
                      }
                    >
                      {projects.map((option) => (
                        <MenuItem
                          key={option.projectId}
                          value={option.projectId}
                        >
                          {option.projectName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      value={entry.technology}
                      onChange={(e) =>
                        handleInputChange(index, "technology", e.target.value)
                      }
                    >
                      {technologies.map((option) => (
                        <MenuItem
                          key={option.technologyId}
                          value={option.technologyId}
                        >
                          {option.technologyname}
                        </MenuItem>
                      ))}
                    </TextField>
                  </StyledTableCell>
                  <StyledTableCell>
                    <textarea
                      value={entry.details || ""}
                      onChange={(e) =>
                        handleInputChange(index, "details", e.target.value)
                      }
                      style={{
                        background: "transparent",
                        width: "100%",
                        height: "50px",
                        fontSize: "14px",
                        padding: "4px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        resize: "none",
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      width: "70px",
                      textAlign: "center",
                      marginTop: "10px",
                    }}
                  >
                    <TextField
                      size="small"
                      type="number"
                      value={entry.duration || ""}
                      onChange={(e) =>
                        handleInputChange(index, "duration", e.target.value)
                      }
                      sx={{
                        width: "60px",
                        height: "60px",
                        "& .MuiOutlinedInput-input": {
                          padding: "4px",
                          textAlign: "center",

                          height: "30px",
                        },
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px", // ✅ Ensures equal spacing between buttons
                      width: "120px",
                    }}
                  >
                    <Button
                      variant="contained" // ✅ Changed from "outlined" to "contained" for consistency
                      color="error"
                      size="small"
                      sx={{
                        minWidth: "40px", // ✅ Ensures the same width
                        padding: "6px 10px", // ✅ Same padding for both buttons
                      }}
                      onClick={() => handleDelete(index)}
                    >
                      <DeleteIcon />
                    </Button>

                    {/* ➕ Add Button */}
                    <Button
                      variant="contained" // ✅ Same "contained" style as delete
                      color="primary"
                      size="small"
                      sx={{
                        minWidth: "40px", // ✅ Ensures same width
                        padding: "6px 10px", // ✅ Same padding
                      }}
                      onClick={handleAdd}
                    >
                      <AddIcon />
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              <StyledTableRow
                sx={{
                  position: "sticky",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  zIndex: 2,
                }}
              >
                <StyledTableCell colSpan={5}></StyledTableCell>
                <StyledTableCell sx={{ textAlign: "center" }}>
                  <b>Total (hrs): {isNaN(totalHours) ? 0 : totalHours}</b>
                </StyledTableCell>
                <StyledTableCell sx={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DoneIcon />}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default TimesheetSelection;

// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Paper,
//   Box,
//   Grid,
//   TextField,
//   Button,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   styled,
//   tableCellClasses,
// } from "@mui/material";

// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import DoneIcon from "@mui/icons-material/Done";
// import ClearIcon from "@mui/icons-material/Clear";
// import { getEntities, getProjects, getTech } from "../../Pages/api.js";

// // ✅ Styled Table Row (Zebra Stripes)
// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   "&:hover": {
//     backgroundColor: "#e0f7fa",
//     cursor: "pointer",
//   },
// }));

// // ✅ Styled Table Header Cell (Purple Header)
// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: "#842988",
//     color: theme.palette.common.white,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     textAlign: "center",
//   },
// }));

// export const TimesheetSelection = () => {
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [entity, setEntity] = useState("");
//   const [entities, setEntities] = useState([]);
//   const [entityId, setEntityId] = useState();
//   const [project, setProject] = useState("");
//   const [projects, setProjects] = useState([]);
//   const [projectId, setProjectId] = useState();
//   const [technology, setTechnology] = useState("");
//   const [technologies, setTechnologies] = useState([]);
//   const [technologyId, setTechnologyId] = useState("");
//   const [duration, setDuration] = useState("");
//   const [details, setDetails] = useState("");
//   const [entries, setEntries] = useState([
//     {
//       entity: "",
//       project: "",
//       technology: "",
//       details: "",
//       duration: "",
//       isEditing: true,
//     },
//   ]);

//   const [totalHours, setTotalHours] = useState(0);

//   const fetchEntity = async () => {
//     try {
//       const data = await getEntities();
//       setEntities(data.data);
//       console.log(entities);
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//     }
//   };

//   const fetchProjects = async (id) => {
//     try {
//       const data = await getProjects(id);
//       setProjects(data.data);
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//     }
//   };

//   const fetchTech = async (id) => {
//     try {
//       const data = await getTech(id);
//       setTechnologies(data.data);
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//     }
//   };

//   useEffect(() => {
//     fetchEntity();
//   }, []);
//   useEffect(() => {
//     console.log("Entities Updated: ", entities);
//   }, [entities]);

//   useEffect(() => {
//     if (entityId) {
//       fetchProjects(entityId);
//     }
//   }, [entityId]);

//   useEffect(() => {
//     if (projectId) {
//       fetchTech(projectId);
//     }
//   }, [projectId]);

//   const isAddDisabled =
//     !entity || !project || !technology || !duration || !details;

//   const handleInputChange = (index, field, value) => {
//     const updatedEntries = [...entries];
//     updatedEntries[index][field] = value;

//     if (field === "entity") {
//       setEntityId(value);
//       console.log(entityId);
//     }
//     if (field === "project") {
//       setProjectId(value);
//     }
//     if (field === "technology") {
//       setTechnologyId(value);
//     }
//     if (field === "duration") {
//       const newTotal = updatedEntries.reduce(
//         (sum, entry) => sum + (parseFloat(entry.duration) || 0),
//         0
//       );
//       if (newTotal > 24) {
//         alert("⚠️ Total hours cannot exceed 24 per day!");
//         return;
//       }
//       setTotalHours(newTotal);
//     }
//     setEntries(updatedEntries);
//   };

//   const handleAdd = () => {
//     const parsedDuration = parseFloat(duration);

//     const newTotal = totalHours + parsedDuration;
//     if (newTotal > 24) {
//       alert(
//         "⚠️ Time limit exceeded! The total cannot exceed 24 hours per day."
//       );
//       return;
//     }

//     const newEntry = {
//       date,
//       entity,
//       project,
//       technology,
//       duration: parsedDuration.toFixed(1),
//       details,
//     };

//     setEntries([...entries, newEntry]);
//     setTotalHours(newTotal);

//     setEntity("");
//     setProject("");
//     setTechnology("");
//     setDuration("");
//     setDetails("");
//   };

//   const handleClear = () => {
//     setEntity("");
//     setProject("");
//     setTechnology("");
//     setDuration("");
//     setDetails("");
//   };

//   const handleDelete = (index) => {
//     const deletedDuration = parseFloat(entries[index].duration);
//     setTotalHours(totalHours - deletedDuration);
//     setEntries(entries.filter((_, i) => i !== index));
//   };

//   const handleSubmit = () => {
//     if (entries.length === 0) {
//       alert("⚠️ No entries to submit!");
//       return;
//     }
//     console.log("Entries: ", JSON.stringify(entries, null, 2));
//     alert("✅ Timesheet submitted successfully!");
//   };

//   return (
//     <div className="containers">
//       <Typography variant="h5" sx={{ mt: 1, mb: 1 }} gutterBottom>
//         Timesheet Entry
//       </Typography>

//       {/* ✅ DATA TABLE */}
//       <Paper
//         sx={{
//           marginTop: 2,
//           padding: 0,
//           borderRadius: "10px 10px 0 0",
//           overflow: "hidden",
//         }}
//       >
//         <TableContainer sx={{ maxHeight: "50vh", overflowY: "auto" }}>
//           <Table stickyHeader>
//             <TableHead>
//               <StyledTableRow>
//                 <StyledTableCell sx={{ width: "5%", textAlign: "center" }}>
//                   S.No
//                 </StyledTableCell>
//                 <StyledTableCell sx={{ width: "10%" }}>Entity</StyledTableCell>
//                 <StyledTableCell sx={{ width: "15%" }}>Project</StyledTableCell>
//                 <StyledTableCell sx={{ width: "20%" }}>
//                   Technology
//                 </StyledTableCell>
//                 <StyledTableCell sx={{ width: "34%" }}>Details</StyledTableCell>
//                 <StyledTableCell sx={{ width: "8%", textAlign: "center" }}>
//                   Duration (hrs)
//                 </StyledTableCell>
//                 <StyledTableCell sx={{ width: "8%", textAlign: "center" }}>
//                   Action
//                 </StyledTableCell>
//               </StyledTableRow>
//             </TableHead>
//             <TableBody>
//               {entries.map((entry, index) => (
//                 <StyledTableRow key={index}>
//                   <StyledTableCell sx={{ width: "40px", textAlign: "center" }}>
//                     {index + 1}
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     <TextField
//                       select
//                       size="small"
//                       value={entry.entity || ""}
//                       onChange={(e) =>
//                         handleInputChange(index, "entity", e.target.value)
//                       }
//                       sx={{ width: "150px" }}
//                     >
//                       {entities.length > 0 ? (
//                         entities.map((option) => (
//                           <MenuItem
//                             key={option.companyId}
//                             value={option.companyId}
//                           >
//                             {option.companyCode}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>No Entities Found</MenuItem>
//                       )}
//                     </TextField>
//                   </StyledTableCell>

//                   <StyledTableCell>
//                     <TextField
//                       select
//                       size="small"
//                       fullWidth
//                       value={entry.project || ""}
//                       onChange={(e) =>
//                         handleInputChange(index, "project", e.target.value)
//                       }
//                     >
//                       {projects.map((option) => (
//                         <MenuItem
//                           key={option.projectId}
//                           value={option.projectId}
//                         >
//                           {option.projectCode}
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     <TextField
//                       select
//                       size="small"
//                       fullWidth
//                       value={entry.technology}
//                       onChange={(e) =>
//                         handleInputChange(index, "technology", e.target.value)
//                       }
//                     >
//                       {technologies.map((option) => (
//                         <MenuItem
//                           key={option.technologyId}
//                           value={option.technologyId}
//                         >
//                           {option.technologyName}
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     <textarea
//                       value={entry.details || ""}
//                       onChange={(e) =>
//                         handleInputChange(index, "details", e.target.value)
//                       }
//                       style={{
//                         background: "transparent",
//                         width: "100%",
//                         height: "50px",
//                         fontSize: "14px",
//                         padding: "4px",
//                         borderRadius: "4px",
//                         border: "1px solid #ccc",
//                         resize: "none",
//                       }}
//                     />
//                   </StyledTableCell>
//                   <StyledTableCell
//                     sx={{
//                       width: "70px",
//                       textAlign: "center",
//                       marginTop: "10px",
//                     }}
//                   >
//                     <TextField
//                       size="small"
//                       type="number"
//                       value={entry.duration || ""}
//                       onChange={(e) =>
//                         handleInputChange(index, "duration", e.target.value)
//                       }
//                       sx={{
//                         width: "60px",
//                         height: "60px",
//                         "& .MuiOutlinedInput-input": {
//                           padding: "4px",
//                           textAlign: "center",
//                           height: "30px",
//                         },
//                       }}
//                     />
//                   </StyledTableCell>
//                   <StyledTableCell
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "8px",
//                       width: "120px",
//                     }}
//                   >
//                     <Button
//                       variant="contained"
//                       color="error"
//                       size="small"
//                       sx={{
//                         minWidth: "40px",
//                         padding: "6px 10px",
//                       }}
//                       onClick={() => handleDelete(index)}
//                     >
//                       <DeleteIcon />
//                     </Button>

//                     <Button
//                       variant="contained"
//                       color="primary"
//                       size="small"
//                       sx={{
//                         minWidth: "40px",
//                         padding: "6px 10px",
//                       }}
//                       onClick={handleAdd}
//                     >
//                       <AddIcon />
//                     </Button>
//                   </StyledTableCell>
//                 </StyledTableRow>
//               ))}
//               <StyledTableRow
//                 sx={{
//                   position: "sticky",
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                   backgroundColor: "#fff",
//                   zIndex: 2,
//                 }}
//               >
//                 <StyledTableCell colSpan={5}></StyledTableCell>
//                 <StyledTableCell sx={{ textAlign: "center" }}>
//                   <b>Total (hrs): {isNaN(totalHours) ? 0 : totalHours}</b>
//                 </StyledTableCell>
//                 <StyledTableCell sx={{ textAlign: "center" }}>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     startIcon={<DoneIcon />}
//                     onClick={handleSubmit}
//                   >
//                     Submit
//                   </Button>
//                 </StyledTableCell>
//               </StyledTableRow>
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </div>
//   );
// };

// export default TimesheetSelection;

//  <Paper
//    sx={{
//      padding: 1,
//      border: "1px solid #ccc",
//      borderRadius: 2,
//      boxShadow: "none",
//    }}
//  >
//    <Box component="form">
//      <Grid container spacing={2}>
//        {/* Row 1 */}
//        <Grid item xs={12} sm={3}>
//          <TextField
//            label="Date"
//            type="date"
//            variant="outlined"
//            fullWidth
//            size="small"
//            value={date}
//            InputLabelProps={{ shrink: true }}
//            InputProps={{ readOnly: true }}
//          />
//        </Grid>

//        <Grid item xs={12} sm={3}>
//          <TextField
//            label="Entity"
//            select
//            variant="outlined"
//            fullWidth
//            size="small"
//            value={entity}
//            onChange={(e) => setEntity(e.target.value)}
//          >
//            {data.entities.map((option, index) => (
//              <MenuItem key={index} value={option}>
//                {option}
//              </MenuItem>
//            ))}
//          </TextField>
//        </Grid>

//        <Grid item xs={12} sm={3}>
//          <TextField
//            label="Project"
//            select
//            variant="outlined"
//            fullWidth
//            size="small"
//            value={project}
//            onChange={(e) => setProject(e.target.value)}
//          >
//            {data.projects.map((option, index) => (
//              <MenuItem key={index} value={option}>
//                {option}
//              </MenuItem>
//            ))}
//          </TextField>
//        </Grid>

//        <Grid item xs={12} sm={3}>
//          <TextField
//            label="Technology"
//            select
//            variant="outlined"
//            fullWidth
//            size="small"
//            value={technology}
//            onChange={(e) => setTechnology(e.target.value)}
//          >
//            {data.technologies.map((option, index) => (
//              <MenuItem key={index} value={option}>
//                {option}
//              </MenuItem>
//            ))}
//          </TextField>
//        </Grid>

//        {/* Row 2 */}
//        <Grid item xs={12} sm={3}>
//          <TextField
//            label="Duration (hrs)"
//            type="number"
//            variant="outlined"
//            fullWidth
//            size="small"
//            value={duration}
//            onChange={(e) => setDuration(e.target.value)}
//            inputProps={{ step: "0.1", min: "0" }}
//          />
//        </Grid>

//        <Grid item xs={12} sm={5}>
//          <TextField
//            label="Details"
//            variant="outlined"
//            fullWidth
//            size="small"
//            value={details}
//            onChange={(e) => setDetails(e.target.value)}
//          />
//        </Grid>

//        <Grid item xs={12} sm={2}>
//          <Button
//            variant="contained"
//            color="primary"
//            fullWidth
//            onClick={handleAdd}
//            startIcon={<AddIcon />}
//            disabled={isAddDisabled}
//          >
//            Add
//          </Button>
//        </Grid>

//        <Grid item xs={12} sm={2}>
//          <Button
//            variant="outlined"
//            color="secondary"
//            fullWidth
//            startIcon={<ClearIcon />}
//            onClick={handleClear}
//          >
//            Clear
//          </Button>
//        </Grid>
//      </Grid>
//    </Box>
//  </Paper>;
