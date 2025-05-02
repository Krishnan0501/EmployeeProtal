    import React, { useState } from 'react';
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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Autocomplete,
    InputAdornment
    } from '@mui/material';
    import {
    Badge,
    Work,
    LocationOn,
    SupervisorAccount,
    Email,
    Phone,
    PhoneIphone,
    PhoneAndroid,
    PhoneCallback,
    Code,
    ContentCopy,
    Edit,
    Close
    } from '@mui/icons-material';

    const EditProfile = () => {
    const [employee, setEmployee] = useState({
        name: "Sarah Johnson",
        title: "Senior Product Designer • Design Department",
        employeeId: "EMP-2023-0042",
        currentProject: "Product X Redesign",
        address: "123 Main Street, San Francisco, CA 94105",
        reportsTo: "Michael Chen, Design Director",
        employmentType: "Full-Time",
        skills: ["UI/UX Design", "Design Systems", "Figma", "Front-end Development"],
        contact: {
        email: "sarah.johnson@company.com",
        phone: "(415) 555-2671",
        mobile: "(415) 555-2672",
        workPhone: "(415) 555-2673"
        }
    });
    const InfoItem = ({ icon, label, value }) => (
        <ListItem>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
            primary={label}
            secondary={value}
            primaryTypographyProps={{ fontWeight: 500 }}
        />
        </ListItem>
    );
    
    const ContactItem = ({ icon, label, value }) => (
        <ListItem>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
            primary={label}
            secondary={value}
            primaryTypographyProps={{ fontWeight: 500 }}
        />
        </ListItem>
    );
    
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editForm, setEditForm] = useState({ ...employee });

    const handleEditOpen = () => {
        setEditForm({ ...employee });
        setOpenEditDialog(true);
    };

    const handleEditClose = () => {
        setOpenEditDialog(false);
    };

    const handleSave = () => {
        setEmployee({ ...editForm });
        setOpenEditDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
        ...prev,
        contact: {
            ...prev.contact,
            [name]: value
        }
        }));
    };

    const handleSkillsChange = (event, value) => {
        setEditForm(prev => ({ ...prev, skills: value }));
    };

    const skillOptions = [
        "UI/UX Design",
        "Design Systems",
        "Figma",
        "Front-end Development",
        "User Research",
        "Prototyping",
        "HTML/CSS",
        "JavaScript",
        "React",
        "Accessibility"
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Main Profile View */}
        <Paper elevation={3} sx={{
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
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
                onClick={handleEditOpen}
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
                {employee.name.split(' ').map(n => n[0]).join('')}
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
                            icon={index === 3 ? <Code /> : undefined}
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
                        icon={<Phone />} 
                        label="Work Phone" 
                        value={employee.contact.phone} 
                        type="phone" 
                        />
                        <ContactItem 
                        icon={<PhoneIphone />} 
                        label="Mobile" 
                        value={employee.contact.mobile} 
                        type="mobile" 
                        />
                        <ContactItem 
                        icon={<PhoneAndroid />} 
                        label="Direct Line" 
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

        {/* Edit Profile Dialog */}
        <Dialog open={openEditDialog} onClose={handleEditClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>Edit Profile</Typography>
            <IconButton onClick={handleEditClose}>
                <Close />
            </IconButton>
            </DialogTitle>
            <DialogContent dividers>
            <Grid container spacing={3} sx={{ pt: 2 }}>
                {/* Non-editable fields */}
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Employee Name"
                    value={employee.name}
                    disabled
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <Badge color="primary" />
                        </InputAdornment>
                    ),
                    }}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Employee ID"
                    value={employee.employeeId}
                    disabled
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <Work color="primary" />
                        </InputAdornment>
                    ),
                    }}
                />
                </Grid>

                {/* Editable fields */}
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    name="title"
                    label="Job Title & Department"
                    value={editForm.title}
                    onChange={handleInputChange}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <Work color="primary" />
                        </InputAdornment>
                    ),
                    }}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="currentProject"
                    label="Current Project"
                    value={editForm.currentProject}
                    onChange={handleInputChange}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <Work color="primary" />
                        </InputAdornment>
                    ),
                    }}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="employmentType"
                    label="Employment Type"
                    value={editForm.employmentType}
                    onChange={handleInputChange}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <Work color="primary" />
                        </InputAdornment>
                    ),
                    }}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    name="address"
                    label="Address"
                    value={editForm.address}
                    onChange={handleInputChange}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <LocationOn color="primary" />
                        </InputAdornment>
                    ),
                    }}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    name="reportsTo"
                    label="Reports To"
                    value={editForm.reportsTo}
                    onChange={handleInputChange}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <SupervisorAccount color="primary" />
                        </InputAdornment>
                    ),
                    }}
                />
                </Grid>
                <Grid item xs={12}>
                <Autocomplete
                    multiple
                    freeSolo
                    options={skillOptions}
                    value={editForm.skills}
                    onChange={handleSkillsChange}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Skills"
                        InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                            <Code color="primary" />
                            </InputAdornment>
                        ),
                        }}
                    />
                    )}
                    renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={index}
                        />
                    ))
                    }
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    value={editForm.contact.email}
                    onChange={handleContactChange}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <Email color="primary" />
                        </InputAdornment>
                    ),
                    }}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="phone"
                    label="Work Phone"
                    value={editForm.contact.phone}
                    onChange={handleContactChange}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <Phone color="primary" />
                        </InputAdornment>
                    ),
                    }}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="mobile"
                    label="Mobile"
                    value={editForm.contact.mobile}
                    onChange={handleContactChange}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <PhoneIphone color="primary" />
                        </InputAdornment>
                    ),
                    }}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="workPhone"
                    label="Direct Line"
                    value={editForm.contact.workPhone}
                    onChange={handleContactChange}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <PhoneAndroid color="primary" />
                        </InputAdornment>
                    ),
                    }}
                />
                </Grid>
            </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleEditClose} variant="outlined" color="primary">
                Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary" startIcon={<Edit />}>
                Save Changes
            </Button>
            </DialogActions>
        </Dialog>
        </Container>
    );
    };

    // ... (Keep the ContactItem and InfoItem components the same as before)

    export default EditProfile;