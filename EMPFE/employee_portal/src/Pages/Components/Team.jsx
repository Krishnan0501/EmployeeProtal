export const TeamLeadTable = ({ teamData, formatDate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTeamData = useMemo(() => {
    if (!searchQuery) return teamData;

    const searchTerms = searchQuery
      .split(",")
      .map((term) => term.trim().toLowerCase());

    return teamData.filter((entry) => {
      const employeeName = entry.name?.toLowerCase() || "";
      const entryDate = entry.date?.toLowerCase() || "";
      const entryDuration = entry.duration?.toString() || "";

      // Check employee-level fields
      const employeeMatch = searchTerms.some(
        (term) =>
          employeeName.includes(term) ||
          entryDate.includes(term) ||
          entryDuration.includes(term)
      );

      // Check task-level fields if data exists
      const taskMatch = (entry.data || []).some((task) =>
        searchTerms.some((term) =>
          [
            task.projectName,
            task.entityName,
            task.technologyName,
            task.description,
            task.remarks,
            task.statusName,
            task.taskName,
          ].some((field) => field?.toLowerCase().includes(term))
        )
      );

      return employeeMatch || taskMatch;
    });
  }, [teamData, searchQuery]);

  if (!teamData || teamData.length === 0) return null;

  return (
    <Paper sx={{ marginTop: 4, padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Team Member Data
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: "50vh", overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#7D287D" }}>
              <StyledTableCell
                colSpan={11}
                sx={{ padding: "8px", backgroundColor: "transparent" }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  size="medium"
                  placeholder="Search within table..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#7D287D" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    backgroundColor: "transparent",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { border: "none" },
                      backgroundColor: "transparent",
                    },
                    input: { color: "white" },
                  }}
                />
              </StyledTableCell>
            </TableRow>

            <TableRow sx={{ backgroundColor: "#7D287D" }}>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell>Employee</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Entity Name</StyledTableCell>
              <StyledTableCell>Project Name</StyledTableCell>
              <StyledTableCell>Technology</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Duration (hrs)</StyledTableCell>
              <StyledTableCell>Task Status</StyledTableCell>
              <StyledTableCell>Remarks</StyledTableCell>
              <StyledTableCell>Review Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((entry, index) => (
              <React.Fragment key={index}>
                {(entry.data || []).map((item, subIndex) => {
                  const bgColor = rowIndex % 2 === 0 ? "#f3e5f5" : "#ede7f6";
                  rowIndex++;

                  return (
                    <TableRow
                      key={`${index}-${subIndex}`}
                      style={{ backgroundColor: bgColor }}
                    >
                      {subIndex === 0 && (
                        <>
                          <TableCell
                            rowSpan={entry.data.length}
                            padding="checkbox"
                          >
                            {/* ✅ Only show one checkbox per group (first row) */}
                            <Checkbox
                              checked={entry.data.every((task) =>
                                selectedTasks.includes(task.workId)
                              )}
                              indeterminate={
                                entry.data.some((task) =>
                                  selectedTasks.includes(task.workId)
                                ) &&
                                !entry.data.every((task) =>
                                  selectedTasks.includes(task.workId)
                                )
                              }
                              onChange={(e) => {
                                const allWorkIds = entry.data.map(
                                  (task) => task.workId
                                );
                                setSelectedTasks((prevSelected) =>
                                  e.target.checked
                                    ? [
                                        ...new Set([
                                          ...prevSelected,
                                          ...allWorkIds,
                                        ]),
                                      ]
                                    : prevSelected.filter(
                                        (id) => !allWorkIds.includes(id)
                                      )
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell rowSpan={entry.data.length}>
                            {index + 1}
                          </TableCell>
                          <TableCell rowSpan={entry.data.length}>
                            {entry.name}
                          </TableCell>
                          <TableCell rowSpan={entry.data.length}>
                            {formatDate(entry.date)}
                          </TableCell>
                        </>
                      )}
                      {/* ✅ Individual Row Data */}
                      <TableCell>{item.companyName}</TableCell>
                      <TableCell>{item.projectName}</TableCell>
                      <TableCell>{item.clientName || "-"}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {item.duration}
                      </TableCell>
                      <TableCell>{item.taskName}</TableCell>
                      <TableCell>{item.remarks}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedTasks.includes(item.workId)}
                          onChange={() => handleCheckboxChange(item.workId)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Total Duration Row */}
                <TableRow>
                  <TableCell colSpan={6} sx={{ backgroundColor: "#d1c4e9" }} />
                  <TableCell
                    sx={{
                      backgroundColor: "#d1c4e9",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    Total Duration:
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#d1c4e9",
                      fontWeight: "bold",
                      textAlign: "end",
                    }}
                  >
                    {entry.duration}
                  </TableCell>
                  <TableCell colSpan={3} sx={{ backgroundColor: "#d1c4e9" }} />
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
