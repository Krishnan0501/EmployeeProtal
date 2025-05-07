import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Paper,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Grid,
  Container,
  Button
} from '@mui/material';
import {
  Badge,
  Work,
  LocationOn,
  SupervisorAccount,
  Email,
  PhoneIphone,
  PhoneAndroid,
  PhoneCallback,
  Code,
  ContentCopy,
  Edit
} from '@mui/icons-material';
import { getEmployeeProfile } from "../../Pages/api.js";
import { useNavigate } from "react-router-dom";

export const EmployeeProfile = () => {
  const employeeData = JSON.parse(sessionStorage.getItem("EmployeeData"));
  console.log("Employee Data:", employeeData); // Log the employee data for debugging
  const userId = employeeData.employeeId;
  console.log("User ID:", userId); // Log the userId for debugging
 // Log the userId for debugging

  const navigate = useNavigate(); // ✅ add this line

  const [employee, setEmployee] = useState(null); // State to hold employee data
  const [loading, setLoading] = useState(true); // State for loading

  const fetchEmployeeProfile = async (id) => {
    try {
      const data = await getEmployeeProfile(id);
      setEmployee(data); 
      setLoading(false); // Stop loading once data is fetched
    } catch (error) {
      console.error("Error fetching employee profile", error);
      setLoading(false); // Stop loading in case of error
    }
  };
  useEffect(() => {
console.log("Employee data:", employee); // Log the employee data for debugging
  },[employee]); // Log the employee data for debugging

  // Fetch the profile data when the component mounts or userId changes
  useEffect(() => {
    if (userId) {
      fetchEmployeeProfile(userId);
    }
  }, [userId]);

  const handleEdit = () => {
    // Navigate to the edit profile page
    navigate("/EditProfile");
    console.log("Edit button clicked");
  };

  // Render a loading indicator if data is being fetched
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  // Render a message if no employee data is available
  if (!employee) {
    return <Typography>No employee data found.</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, maxHeight: '70vh', overflowY: 'auto' }}>
      <Paper elevation={3} sx={{
        borderRadius: 3,
        mt: 5,
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 1,
          left: 0,
          right: 0,
          height: 6,
          background: 'linear-gradient(90deg, #3f51b5, #757de8)'
        }
      }}>
        {/* Edit Button - Top Right */}
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            Edit Profile
          </Button>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Header with Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{
              width: 80,
              height: 80,
              mr: 3,
              bgcolor: 'primary.main',
              fontSize: '2rem'
            }}>
              {employee.name.charAt(0)} {/* Use first character of the name */}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight={600}>
                {employee.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {employee.title}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={4}>
            {/* Left Column - Employee Information */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{
                p: 3,
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                position: 'relative'
              }}>
                <Typography variant="h6" component="h2" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
                  Profile Details
                </Typography>

                <List dense disablePadding>
                  <InfoItem icon={<Badge />} label="Employee ID" value={employee.employeeId} />
                  <InfoItem icon={<Work />} label="Current Project" value={employee.currentProject} />
                  <InfoItem icon={<LocationOn />} label="Address" value={employee.address} />
                  <InfoItem icon={<SupervisorAccount />} label="Reports To" value={employee.reportsTo} />
                  <InfoItem icon={<Work />} label="Employment Type" value={employee.employmentType} />
                </List>
              </Paper>
            </Grid>

            {/* Right Column - Skills and Contact */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Skills Box */}
                <Paper elevation={0} sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  position: 'relative'
                }}>
                  <Typography variant="h6" component="h2" gutterBottom fontWeight={600}>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {employee.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        icon={index === 5 ? <Code /> : undefined}
                        color={index % 2 ? 'primary' : 'default'}
                        variant="outlined"
                        sx={{
                          borderRadius: 1,
                          fontWeight: index < 3 ? 600 : 400
                        }}
                      />
                    ))}
                  </Box>
                </Paper>

                {/* Contact Box */}
                <Paper elevation={0} sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  position: 'relative'
                }}>
                  <Typography variant="h6" component="h2" gutterBottom fontWeight={600}>
                    Contact Information
                  </Typography>
                  <List dense disablePadding>
                    <ContactItem
                      icon={<Email />}
                      label="Email"
                      value={employee.contact.email}
                      type="email"
                    />
                    <ContactItem
                      icon={<PhoneIphone />}
                      label="Mobile"
                      value={employee.contact.mobile}
                      type="mobile"
                    />
                    <ContactItem
                      icon={<PhoneAndroid />}
                      label="Alternate Mobile"
                      value={employee.contact.workPhone}
                      type="work"
                    />
                  </List>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

// Enhanced ContactItem component with copy functionality
const ContactItem = ({ icon, label, value, type }) => (
  <ListItem disableGutters sx={{ py: 0.5 }}>
    <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
      {icon}
    </ListItemIcon>
    <ListItemText
      primary={
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      }
      secondary={
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <Typography variant="body1" sx={{ mr: 1 }}>
            {value}
          </Typography>
          <Tooltip title="Copy to clipboard">
            <IconButton size="small" onClick={() => navigator.clipboard.writeText(value)}>
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>
          {type === 'phone' && (
            <Tooltip title="Call">
              <IconButton size="small" href={`tel:${value.replace(/[^\d]/g, '')}`}>
                <PhoneCallback fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {type === 'email' && (
            <Tooltip title="Send email">
              <IconButton size="small" href={`mailto:${value}`}>
                <Email fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      }
      secondaryTypographyProps={{ component: 'div' }}
    />
  </ListItem>
);

// Original InfoItem component
const InfoItem = ({ icon, label, value }) => (
  <ListItem disableGutters sx={{ py: 0.5 }}>
    <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
      {icon}
    </ListItemIcon>
    <ListItemText
      primary={
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      }
      secondary={
        <Typography variant="body1" sx={{ mt: 0.5 }}>
          {value}
        </Typography>
      }
      secondaryTypographyProps={{ component: 'div' }}
    />
  </ListItem>
);
