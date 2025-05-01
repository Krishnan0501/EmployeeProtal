import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { getTotalWorkingHours } from "../Pages/api.js";

const PIE_COLORS = ["#9c27b0", "#ce93d8", "#ab47bc", "#ba68c8", "#7b1fa2"];
const YEARS = [2022, 2023, 2024, 2025];

const cardStyles = {
  border: "2px solid #9c27b0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

export function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState(2025); // Set default year as 2025
  const [projectData, setProjectData] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [avgWorkChart, setAvgWorkChart] = useState([]);
  const [extraHourChart, setExtraHourChart] = useState([]);
  const [totalWorkingHours, setTotalWorkingHours] = useState(0);
  const [lossHours, setLossHours] = useState("0:00");

  // Convert HH:MM time to minutes
  const convertTimeToMinutes = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string" || !timeStr.includes(":")) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Fetch data for the selected year
  const fetchYearlyData = async (year) => {
    if (!year) return;

    const result = await getTotalWorkingHours(year); // Fetch data for the selected year
    setTotalWorkingHours(result.totalWorkingHours || 0);
    setLossHours(result.lossHours || "0:00");

    if (result.projectMembers) {
      const barData = result.projectMembers.map((item) => ({
        name: item.projectName,
        hours: item.employeeCount,
      }));
      const total = result.projectMembers.reduce(
        (acc, item) => acc + item.employeeCount,
        0
      );
      setProjectData(barData);
      setTotalEmployees(total);
    }

    if (result.averageWorking?.length) {
      // Convert time data to minutes for the pie chart
      const pieData = result.averageWorking.map((item) => ({
        name: item.monthYear,
        label: item.totalWorkingHoursAllEmployees,
        value: convertTimeToMinutes(item.totalWorkingHoursAllEmployees),
      }));
      setAvgWorkChart(pieData);
    }

    if (result.monthWorkingExtraHour?.length) {
      const extraPieData = result.monthWorkingExtraHour.map((item) => {
        const numeric = parseFloat(item.above9Hours);
        const hours = Math.floor(numeric);
        const minutes = Math.round((numeric - hours) * 60);
        const totalMinutes = hours * 60 + minutes;

        return {
          name: item.monthYear,
          label: `${hours}h ${minutes}m`,
          value: totalMinutes,
        };
      });
      setExtraHourChart(extraPieData);
    } else {
      // 💥 CLEAR OLD DATA if no result found
      setExtraHourChart([]);
    }
  };

  // Handle year change event
  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
    fetchYearlyData(newYear); // Fetch data for selected year
  };

  // Auto-fetch data for the default year on load
  useEffect(() => {
    fetchYearlyData(selectedYear); // This ensures 2025 is passed initially
  }, [selectedYear]);
  useEffect(() => {
    const employeeData = JSON.parse(sessionStorage.getItem("EmployeeData"));
    const entityId = employeeData?.entityId;
    const entityName = entityId === 1 ? "B-SEC" : "IAGAMI";
    document.title = `Employee | ${entityName} | Dashboard`;
  }, []);
  return (
    <Box sx={{ pt: 8, px: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Select Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              label="Select Year"
            >
              {YEARS.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography variant="subtitle1">Total Employees</Typography>
                <Typography variant="h6">{totalEmployees}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  Work Summary
                </Typography>
                <Typography variant="body2">
                  <strong>Total Working Hours:</strong> {totalWorkingHours} hrs
                </Typography>
                <Typography variant="body2">
                  <strong>Loss Hours:</strong> {lossHours}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Chart Section */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ border: "2px solid #9c27b0", boxShadow: 3 }}>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      textAlign="center"
                      gutterBottom
                    >
                      Employee Distribution by Project
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={projectData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          label={{
                            value: "Employee Count",
                            angle: -90,
                            position: "insideLeft",
                            offset: 10,
                            style: { textAnchor: "middle" },
                          }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}`, "Employee Count"]}
                          cursor={{ fill: "rgba(156, 39, 176, 0.1)" }}
                        />
                        <Bar dataKey="hours" fill="#9c27b0" barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ border: "2px solid #9c27b0", boxShadow: 3 }}>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      textAlign="center"
                      gutterBottom
                    >
                      Average Working Hours per Month
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={avgWorkChart}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, index }) =>
                            `${name} (${avgWorkChart[index].label})`
                          }
                        >
                          {avgWorkChart.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Extra Hours Pie Chart */}
          <Grid item xs={12}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  textAlign="center"
                  gutterBottom
                >
                  Extra Working Hours Above 9 (Monthly)
                </Typography>
                {extraHourChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={extraHourChart}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, index }) =>
                          `${name} (${extraHourChart[index].label})`
                        }
                      >
                        {extraHourChart.map((_, index) => (
                          <Cell
                            key={`extra-cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                    No extra working hour data available.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
