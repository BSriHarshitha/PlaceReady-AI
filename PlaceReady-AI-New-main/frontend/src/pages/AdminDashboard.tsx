import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Tabs,
  Tab,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Group,
  TrendingUp,
  CheckCircle,
  Download,
  Visibility,
  Assessment,
  Search,
  MoreVert,
  Email,
  Phone,
  School,
  Delete,
  Edit,
  Refresh
} from '@mui/icons-material';
import { apiService } from '../services/apiService';
import { AdminCharts } from '../components/AdminCharts';
import { exportToCSV, exportToJSON, exportBatchReport } from '../utils/ExportUtils';
import { toastManager } from '../utils/ToastNotification';
import { Select, MenuItem, FormControl, InputLabel, TableSortLabel } from '@mui/material';
import {
  FileDownload,
  PictureAsPdf,
  InsertChart,
  FilterList,
  Sort,
  Email as EmailIcon,
  Notifications,
  Assessment as AssessmentIcon,
  BarChart,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserForMenu, setSelectedUserForMenu] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [trainingPlanDialogOpen, setTrainingPlanDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await apiService.getAllUsers();
      const usersWithMetadata = allUsers.map((user: any) => ({
        ...user,
        registrationDate: user.registrationDate || new Date().toISOString(),
        lastActive: user.lastActive || new Date().toISOString()
      }));
      setUsers(usersWithMetadata);
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback to localStorage
      const localUsers: any[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('profile_')) {
          const uid = key.replace('profile_', '');
          const profile = JSON.parse(localStorage.getItem(key) || '{}');
          const analysis = localStorage.getItem(`analysis_${uid}`);
          
          localUsers.push({
            uid,
            ...profile,
            analysis: analysis ? JSON.parse(analysis) : null,
            registrationDate: profile.registrationDate || new Date().toISOString(),
            lastActive: profile.lastActive || new Date().toISOString()
          });
        }
      }
      setUsers(localUsers);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserForMenu(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserForMenu(null);
  };

  const deleteUser = (uid: string) => {
    localStorage.removeItem(`profile_${uid}`);
    localStorage.removeItem(`analysis_${uid}`);
    loadUsers();
    handleMenuClose();
  };

  const editUser = (user: any) => {
    setEditingUser(user);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const saveUserEdit = async () => {
    if (editingUser) {
      try {
        await apiService.saveUserProfile(editingUser.uid, editingUser);
        localStorage.setItem(`profile_${editingUser.uid}`, JSON.stringify(editingUser));
        loadUsers();
        setEditDialogOpen(false);
        setEditingUser(null);
      } catch (error) {
        console.error('Error saving user:', error);
        alert('Failed to save user changes');
      }
    }
  };

  const scheduleAssessment = () => {
    setAssessmentDialogOpen(true);
  };

  const generateTrainingPlan = () => {
    setTrainingPlanDialogOpen(true);
  };

  const sendBulkNotification = () => {
    setNotificationDialogOpen(true);
  };

  const handleBulkNotification = () => {
    const targetUsers = selectedUsers.length > 0 ? selectedUsers : users.map(u => u.uid);
    alert(`Notification sent to ${targetUsers.length} users!`);
    setNotificationDialogOpen(false);
    setNotificationMessage('');
    setSelectedUsers([]);
  };

  const generateDetailedReport = () => {
    setReportDialogOpen(true);
  };

  const toggleUserSelection = (uid: string) => {
    setSelectedUsers(prev => 
      prev.includes(uid) 
        ? prev.filter(id => id !== uid)
        : [...prev, uid]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(u => u.uid));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const exportUserData = (format: 'csv' | 'json' | 'pdf' = 'json') => {
    try {
      if (format === 'csv') {
        exportToCSV(filteredUsers);
        toastManager.success('Data exported to CSV successfully!');
      } else if (format === 'json') {
        exportToJSON(filteredUsers);
        toastManager.success('Data exported to JSON successfully!');
      } else if (format === 'pdf') {
        exportBatchReport(filteredUsers);
        toastManager.success('Batch report generated successfully!');
      }
      setExportDialogOpen(false);
    } catch (error) {
      toastManager.error('Failed to export data. Please try again.');
    }
  };

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'name':
        aValue = a.name || '';
        bValue = b.name || '';
        break;
      case 'score':
        aValue = a.analysis?.finalScore || 0;
        bValue = b.analysis?.finalScore || 0;
        break;
      case 'date':
        aValue = new Date(a.registrationDate || 0).getTime();
        bValue = new Date(b.registrationDate || 0).getTime();
        break;
      case 'branch':
        aValue = a.branch || '';
        bValue = b.branch || '';
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const sendBulkEmail = () => {
    const targetUsers = selectedUsers.length > 0 ? selectedUsers : users.map(u => u.uid);
    const emails = users
      .filter(u => targetUsers.includes(u.uid))
      .map(u => u.email)
      .filter(Boolean)
      .join(',');
    
    window.open(`mailto:${emails}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
    toastManager.success(`Email client opened for ${targetUsers.length} users`);
    setEmailDialogOpen(false);
    setEmailSubject('');
    setEmailBody('');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.branch?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'analyzed') return matchesSearch && user.analysis;
    if (filterStatus === 'pending') return matchesSearch && !user.analysis;
    if (filterStatus === 'ready') return matchesSearch && user.analysis?.finalScore >= 70;
    if (filterStatus === 'needs-improvement') return matchesSearch && user.analysis?.finalScore < 50;
    
    return matchesSearch;
  });

  const getReadinessStats = () => {
    const totalUsers = users.length;
    const usersWithAnalysis = users.filter(u => u.analysis);
    const ready = usersWithAnalysis.filter(u => u.analysis.finalScore >= 70).length;
    const almostReady = usersWithAnalysis.filter(u => u.analysis.finalScore >= 50 && u.analysis.finalScore < 70).length;
    const needsImprovement = usersWithAnalysis.filter(u => u.analysis.finalScore < 50).length;
    const avgScore = usersWithAnalysis.length > 0 
      ? Math.round(usersWithAnalysis.reduce((sum, u) => sum + u.analysis.finalScore, 0) / usersWithAnalysis.length)
      : 0;
    
    return { totalUsers, ready, almostReady, needsImprovement, avgScore, analyzed: usersWithAnalysis.length };
  };

  const stats = getReadinessStats();

  const getStatusFromScore = (score: number) => {
    if (score >= 70) return 'Ready';
    if (score >= 50) return 'Almost Ready';
    return 'Needs Improvement';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'success';
      case 'Almost Ready': return 'warning';
      case 'Needs Improvement': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ pt: 12, pb: 8, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Placement Analytics Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor batch performance and manage student data
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<Refresh />}
              onClick={loadUsers}
            >
              Refresh
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<FileDownload />}
              onClick={() => setExportDialogOpen(true)}
            >
              Export
            </Button>
            <Button 
              variant="contained" 
              startIcon={<PictureAsPdf />}
              onClick={() => exportUserData('pdf')}
              sx={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' }}
            >
              Generate Report
            </Button>
          </Box>
        </Box>

        {/* Tabs for different views */}
        <Paper sx={{ mb: 4 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Overview" />
            <Tab label="Student Management" />
            <Tab label="Analytics" />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          {/* Key Metrics */}
          <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
            <Card sx={{ flex: 1, minWidth: 200 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Group sx={{ fontSize: 40, color: '#4f46e5', mb: 1 }} />
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.totalUsers}</Typography>
                <Typography variant="body2" color="text.secondary">Total Students</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, minWidth: 200 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assessment sx={{ fontSize: 40, color: '#06b6d4', mb: 1 }} />
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.analyzed}</Typography>
                <Typography variant="body2" color="text.secondary">Analyzed</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, minWidth: 200 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.ready}</Typography>
                <Typography variant="body2" color="text.secondary">Placement Ready</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, minWidth: 200 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.avgScore}%</Typography>
                <Typography variant="body2" color="text.secondary">Avg Readiness</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Training Recommendations */}
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Training Recommendations
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper sx={{ p: 2, backgroundColor: '#fef2f2' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#dc2626' }}>
                        Critical: {stats.needsImprovement} students need improvement
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Students with readiness score below 50%
                      </Typography>
                    </Paper>
                    <Paper sx={{ p: 2, backgroundColor: '#fffbeb' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#d97706' }}>
                        Important: {stats.almostReady} students almost ready
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Students with readiness score 50-69%
                      </Typography>
                    </Paper>
                    <Paper sx={{ p: 2, backgroundColor: '#f0fdf4' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#16a34a' }}>
                        Good: {stats.ready} students placement ready
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Students with readiness score 70% and above
                      </Typography>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }} onClick={scheduleAssessment}>
                      Schedule Batch Assessment
                    </Button>
                    <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }} onClick={generateTrainingPlan}>
                      Generate Training Plan
                    </Button>
                    <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }} onClick={sendBulkNotification}>
                      Send Bulk Notifications
                    </Button>
                    <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }} onClick={generateDetailedReport}>
                      View Detailed Analytics
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2">
                {selectedUsers.length} selected
              </Typography>
              <Button size="small" onClick={clearSelection}>
                Clear
              </Button>
              <Button 
                variant="contained" 
                size="small"
                onClick={sendBulkNotification}
              >
                Send Notification
              </Button>
            </Box>
          )}

          {/* Search and Filter */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ minWidth: 300 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterStatus}
                label="Filter by Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Students</MenuItem>
                <MenuItem value="analyzed">Analyzed</MenuItem>
                <MenuItem value="pending">Pending Analysis</MenuItem>
                <MenuItem value="ready">Placement Ready</MenuItem>
                <MenuItem value="needs-improvement">Needs Improvement</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Student Management Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Student Management ({filteredUsers.length} students)
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <input 
                          type="checkbox" 
                          onChange={(e) => e.target.checked ? selectAllUsers() : clearSelection()}
                          checked={selectedUsers.length === sortedUsers.length && sortedUsers.length > 0}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        <TableSortLabel
                          active={sortField === 'name'}
                          direction={sortField === 'name' ? sortOrder : 'asc'}
                          onClick={() => handleSort('name')}
                        >
                          Student
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        <TableSortLabel
                          active={sortField === 'branch'}
                          direction={sortField === 'branch' ? sortOrder : 'asc'}
                          onClick={() => handleSort('branch')}
                        >
                          Branch
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        <TableSortLabel
                          active={sortField === 'score'}
                          direction={sortField === 'score' ? sortOrder : 'asc'}
                          onClick={() => handleSort('score')}
                        >
                          Readiness
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        <TableSortLabel
                          active={sortField === 'date'}
                          direction={sortField === 'date' ? sortOrder : 'asc'}
                          onClick={() => handleSort('date')}
                        >
                          Last Active
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedUsers.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell padding="checkbox">
                          <input 
                            type="checkbox" 
                            checked={selectedUsers.includes(user.uid)}
                            onChange={() => toggleUserSelection(user.uid)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#4f46e5' }}>
                              {user.name?.charAt(0) || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {user.name || 'Unknown'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {user.uid?.substring(0, 8)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">{user.email || 'N/A'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">{user.phone || 'N/A'}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.branch || 'N/A'} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {user.analysis ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {user.analysis.finalScore}%
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={user.analysis.finalScore}
                                sx={{ width: 60, height: 6 }}
                              />
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Not Analyzed
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.analysis ? (
                            <Chip 
                              label={getStatusFromScore(user.analysis.finalScore)} 
                              color={getStatusColor(getStatusFromScore(user.analysis.finalScore)) as any}
                              size="small"
                            />
                          ) : (
                            <Chip label="Pending" color="default" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(user.lastActive).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setOpenDialog(true);
                                }}
                                disabled={!user.analysis}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="More Actions">
                              <IconButton 
                                size="small"
                                onClick={(e) => handleMenuClick(e, user)}
                              >
                                <MoreVert />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AdminCharts users={users} />
          
          {/* Skill Gap Analysis */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Batch Skill Gap Analysis
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                {Object.entries(
                  users.reduce((acc: Record<string, number>, user) => {
                    user.analysis?.skillGaps?.forEach((gap: string) => {
                      acc[gap] = (acc[gap] || 0) + 1;
                    });
                    return acc;
                  }, {})
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([gap, count]) => (
                    <Paper key={gap} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {gap}
                      </Typography>
                      <Chip label={`${count} students`} color="warning" size="small" />
                    </Paper>
                  ))}
              </Box>
            </CardContent>
          </Card>

          {/* Placement Prediction */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Placement Readiness Prediction
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                <Card sx={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#16a34a', mb: 1 }}>
                      {Math.round((stats.ready / users.length) * 100) || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      High Placement Probability ({stats.ready} students)
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ backgroundColor: '#fffbeb', border: '1px solid #fde047' }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#d97706', mb: 1 }}>
                      {Math.round((stats.almostReady / users.length) * 100) || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Moderate Placement Probability ({stats.almostReady} students)
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5' }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626', mb: 1 }}>
                      {Math.round((stats.needsImprovement / users.length) * 100) || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Low Placement Probability ({stats.needsImprovement} students)
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => editUser(selectedUserForMenu)}>
            <Edit sx={{ mr: 1 }} /> Edit Profile
          </MenuItem>
          <MenuItem onClick={() => {
            if (selectedUserForMenu?.email) {
              window.open(`mailto:${selectedUserForMenu.email}`);
            }
            handleMenuClose();
          }}>
            <Email sx={{ mr: 1 }} /> Send Email
          </MenuItem>
          <MenuItem 
            onClick={() => {
              if (selectedUserForMenu?.uid) {
                deleteUser(selectedUserForMenu.uid);
              }
            }}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} /> Delete User
          </MenuItem>
        </Menu>

        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogContent>
            {editingUser && (
              <Box sx={{ pt: 1 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Branch"
                  value={editingUser.branch || ''}
                  onChange={(e) => setEditingUser({...editingUser, branch: e.target.value})}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={saveUserEdit}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Assessment Dialog */}
        <Dialog open={assessmentDialogOpen} onClose={() => setAssessmentDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Schedule Batch Assessment</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Schedule a comprehensive assessment for all students.
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              label="Assessment Date & Time"
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Instructions"
              placeholder="Enter instructions..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssessmentDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => {
              alert('Assessment scheduled!');
              setAssessmentDialogOpen(false);
            }}>Schedule</Button>
          </DialogActions>
        </Dialog>

        {/* Training Plan Dialog */}
        <Dialog open={trainingPlanDialogOpen} onClose={() => setTrainingPlanDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Generate Training Plan</DialogTitle>
          <DialogContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Recommended Training Areas</Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Critical Skills ({stats.needsImprovement} students)</Typography>
              System Design, Data Structures, Communication Skills
            </Alert>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Improvement Areas ({stats.almostReady} students)</Typography>
              Cloud Technologies, Project Management, Interview Prep
            </Alert>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Additional Notes"
              placeholder="Custom recommendations..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTrainingPlanDialogOpen(false)}>Close</Button>
            <Button variant="contained" onClick={() => {
              alert('Training plan generated!');
              setTrainingPlanDialogOpen(false);
            }}>Generate</Button>
          </DialogActions>
        </Dialog>

        {/* Notification Dialog */}
        <Dialog open={notificationDialogOpen} onClose={() => setNotificationDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {selectedUsers.length > 0 
                ? `Sending to ${selectedUsers.length} selected students`
                : `Sending to all ${users.length} students`
              }
            </Typography>
            <TextField
              fullWidth
              label="Subject"
              sx={{ mb: 2 }}
              placeholder="Enter subject..."
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Enter message..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNotificationDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleBulkNotification}>Send</Button>
          </DialogActions>
        </Dialog>

        {/* Report Dialog */}
        <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Detailed Analytics</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Card sx={{ flex: 1, minWidth: 150 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">{stats.totalUsers}</Typography>
                  <Typography variant="body2">Total</Typography>
                </CardContent>
              </Card>
              <Card sx={{ flex: 1, minWidth: 150 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">{stats.ready}</Typography>
                  <Typography variant="body2">Ready</Typography>
                </CardContent>
              </Card>
              <Card sx={{ flex: 1, minWidth: 150 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">{stats.almostReady}</Typography>
                  <Typography variant="body2">Almost</Typography>
                </CardContent>
              </Card>
              <Card sx={{ flex: 1, minWidth: 150 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">{stats.needsImprovement}</Typography>
                  <Typography variant="body2">Need Help</Typography>
                </CardContent>
              </Card>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReportDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced User Details Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#4f46e5' }}>
                {selectedUser?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h6">{selectedUser?.name} - Detailed Analysis</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUser?.email} • {selectedUser?.branch}
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedUser?.analysis && (
              <Box>
                {/* Personal Information */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Personal Information
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Email sx={{ fontSize: 20, color: 'text.secondary' }} />
                          <Typography variant="body2">{selectedUser.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
                          <Typography variant="body2">{selectedUser.phone || 'N/A'}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <School sx={{ fontSize: 20, color: 'text.secondary' }} />
                          <Typography variant="body2">{selectedUser.branch || 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Registered: {new Date(selectedUser.registrationDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Performance Scores */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <Card sx={{ flex: 1, minWidth: 150 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {selectedUser.analysis.finalScore}%
                      </Typography>
                      <Typography variant="body2">Overall Score</Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ flex: 1, minWidth: 150 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {selectedUser.analysis.resumeScore}%
                      </Typography>
                      <Typography variant="body2">Resume Score</Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ flex: 1, minWidth: 150 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {selectedUser.analysis.codingScore}%
                      </Typography>
                      <Typography variant="body2">Coding Score</Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ flex: 1, minWidth: 150 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {selectedUser.analysis.linkedinScore}%
                      </Typography>
                      <Typography variant="body2">Profile Score</Typography>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: 1, minWidth: 300 }}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Identified Skills
                        </Typography>
                        <Box>
                          {selectedUser.analysis.skills.map((skill: string, index: number) => (
                            <Chip 
                              key={index} 
                              label={skill} 
                              color="primary" 
                              sx={{ mr: 1, mb: 1 }} 
                              size="small"
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 300 }}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Skill Gaps
                        </Typography>
                        <Box>
                          {selectedUser.analysis.skillGaps.map((gap: string, index: number) => (
                            <Chip 
                              key={index} 
                              label={gap} 
                              color="warning" 
                              variant="outlined"
                              sx={{ mr: 1, mb: 1 }} 
                              size="small"
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>

                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Recommendations
                    </Typography>
                    <ul>
                      {selectedUser.analysis.recommendations.map((rec: string, index: number) => (
                        <li key={index}>
                          <Typography variant="body2">{rec}</Typography>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            <Button variant="contained" onClick={() => {
              // Generate individual report
              console.log('Generate report for:', selectedUser?.name);
            }}>
              Generate Report
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard;