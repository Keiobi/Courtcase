'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  TextField, 
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  CircularProgress,
  Alert,
  Tooltip,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  fetchCases, 
  setSearchTerm, 
  setStatusFilter, 
  clearFilters, 
  setSorting,
  softDeleteCase,
  restoreCase,
  permanentlyDeleteCase,
  Case,
  CaseStatus
} from '@/features/cases/casesSlice';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Case listing page component
 * Displays a list of cases with search, filtering, and sorting capabilities
 */
export default function CasesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentUser, isLoading: authLoading, authInitialized } = useAuth();
  
  // Get cases state from Redux
  const { 
    cases, 
    loading, 
    error, 
    searchTerm, 
    filters, 
    sorting 
  } = useAppSelector((state) => state.cases);
  
  // Local state for UI
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  
  // Fetch cases on component mount
  useEffect(() => {
    if (authInitialized && currentUser && !authLoading) {
      dispatch(fetchCases());
    }
  }, [dispatch, currentUser, authLoading, authInitialized]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (authInitialized && !currentUser && !authLoading) {
      router.push('/login');
    }
  }, [currentUser, authLoading, authInitialized, router]);
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    dispatch(setStatusFilter(event.target.value as CaseStatus | 'All'));
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  // Handle sorting
  const handleSortChange = (field: keyof Case) => {
    const direction = sorting.field === field && sorting.direction === 'asc' ? 'desc' : 'asc';
    dispatch(setSorting({ field, direction }));
    handleSortMenuClose();
  };
  
  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle case actions menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, caseId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedCaseId(caseId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCaseId(null);
  };
  
  // Handle filter menu
  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchorEl(event.currentTarget);
  };
  
  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null);
  };
  
  // Handle sort menu
  const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortMenuAnchorEl(event.currentTarget);
  };
  
  const handleSortMenuClose = () => {
    setSortMenuAnchorEl(null);
  };
  
  // Handle view case
  const handleViewCase = (caseId: string) => {
    router.push(`/cases/${caseId}`);
    handleMenuClose();
  };
  
  // Handle edit case
  const handleEditCase = (caseId: string) => {
    router.push(`/cases/${caseId}/edit`);
    handleMenuClose();
  };
  
  // Handle delete case
  const handleDeleteCase = (caseId: string) => {
    dispatch(softDeleteCase(caseId));
    handleMenuClose();
  };
  
  // Handle restore case
  const handleRestoreCase = (caseId: string) => {
    dispatch(restoreCase(caseId));
    handleMenuClose();
  };
  
  // Handle permanently delete case
  const handlePermanentlyDeleteCase = (caseId: string) => {
    dispatch(permanentlyDeleteCase(caseId));
    handleMenuClose();
  };
  
  // Filter and sort cases
  const filteredCases = cases.filter((caseItem) => {
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.currentSummary.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = filters.status === 'All' || caseItem.status === filters.status;
    
    // Apply date range filter (if implemented)
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort cases
  const sortedCases = [...filteredCases].sort((a, b) => {
    const { field, direction } = sorting;
    
    // Handle different field types
    if (field === 'updatedAt' || field === 'createdAt' || field === 'deletedAt') {
      const dateA = a[field] ? new Date(a[field]).getTime() : 0;
      const dateB = b[field] ? new Date(b[field]).getTime() : 0;
      
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    // Handle string fields
    if (typeof a[field] === 'string' && typeof b[field] === 'string') {
      const valueA = (a[field] as string).toLowerCase();
      const valueB = (b[field] as string).toLowerCase();
      
      return direction === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    // Handle boolean fields
    if (typeof a[field] === 'boolean' && typeof b[field] === 'boolean') {
      const valueA = a[field] as boolean;
      const valueB = b[field] as boolean;
      
      return direction === 'asc'
        ? (valueA === valueB ? 0 : valueA ? 1 : -1)
        : (valueA === valueB ? 0 : valueA ? -1 : 1);
    }
    
    return 0;
  });
  
  // Paginate cases
  const paginatedCases = sortedCases.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Get status chip color
  const getStatusChipColor = (status: CaseStatus) => {
    switch (status) {
      case 'Open':
        return 'primary';
      case 'Closed':
        return 'default';
      case 'Pending':
        return 'warning';
      case 'Deleted':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Show loading indicator while checking auth state
  if (authLoading) {
    return (
      <Container>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Cases
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => router.push('/cases/new')}
          >
            New Case
          </Button>
        </Box>
        
        {/* Search and filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search cases..."
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1, minWidth: '200px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: '150px' }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={filters.status}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
                <MenuItem value="Deleted">Deleted</MenuItem>
              </Select>
            </FormControl>
            
            <Tooltip title="More filters">
              <IconButton onClick={handleFilterMenuOpen}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Sort">
              <IconButton onClick={handleSortMenuOpen}>
                <SortIcon />
              </IconButton>
            </Tooltip>
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </Box>
        </Paper>
        
        {/* Filter menu */}
        <Menu
          anchorEl={filterMenuAnchorEl}
          open={Boolean(filterMenuAnchorEl)}
          onClose={handleFilterMenuClose}
        >
          <MenuItem disabled>
            <Typography variant="subtitle2">Date Range (Coming Soon)</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClearFilters}>Clear All Filters</MenuItem>
        </Menu>
        
        {/* Sort menu */}
        <Menu
          anchorEl={sortMenuAnchorEl}
          open={Boolean(sortMenuAnchorEl)}
          onClose={handleSortMenuClose}
        >
          <MenuItem onClick={() => handleSortChange('updatedAt')}>
            Last Updated {sorting.field === 'updatedAt' && (sorting.direction === 'asc' ? '↑' : '↓')}
          </MenuItem>
          <MenuItem onClick={() => handleSortChange('createdAt')}>
            Date Created {sorting.field === 'createdAt' && (sorting.direction === 'asc' ? '↑' : '↓')}
          </MenuItem>
          <MenuItem onClick={() => handleSortChange('caseNumber')}>
            Case Number {sorting.field === 'caseNumber' && (sorting.direction === 'asc' ? '↑' : '↓')}
          </MenuItem>
          <MenuItem onClick={() => handleSortChange('clientName')}>
            Client Name {sorting.field === 'clientName' && (sorting.direction === 'asc' ? '↑' : '↓')}
          </MenuItem>
          <MenuItem onClick={() => handleSortChange('status')}>
            Status {sorting.field === 'status' && (sorting.direction === 'asc' ? '↑' : '↓')}
          </MenuItem>
        </Menu>
        
        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {/* Cases table */}
        {!loading && (
          <>
            {paginatedCases.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No cases found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {searchTerm || filters.status !== 'All' 
                    ? 'Try clearing your filters or search term'
                    : 'Create your first case to get started'}
                </Typography>
                {(!searchTerm && filters.status === 'All') && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/cases/new')}
                    sx={{ mt: 2 }}
                  >
                    Create Case
                  </Button>
                )}
              </Paper>
            ) : (
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Case Number</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>Summary</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Last Updated</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedCases.map((caseItem) => (
                        <TableRow 
                          key={caseItem.id}
                          sx={{ 
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                            ...(caseItem.isDeleted ? { opacity: 0.6 } : {})
                          }}
                        >
                          <TableCell>{caseItem.caseNumber}</TableCell>
                          <TableCell>{caseItem.clientName}</TableCell>
                          <TableCell sx={{ maxWidth: '300px' }}>
                            <Typography noWrap>{caseItem.currentSummary}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={caseItem.status} 
                              color={getStatusChipColor(caseItem.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(caseItem.updatedAt)}</TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="more"
                              onClick={(e) => handleMenuOpen(e, caseItem.id)}
                              size="small"
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredCases.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            )}
          </>
        )}
        
        {/* Case actions menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {selectedCaseId && (
            <>
              <MenuItem onClick={() => handleViewCase(selectedCaseId)}>
                <ListItemIcon>
                  <VisibilityIcon fontSize="small" />
                </ListItemIcon>
                View
              </MenuItem>
              
              <MenuItem onClick={() => handleEditCase(selectedCaseId)}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                Edit
              </MenuItem>
              
              {cases.find(c => c.id === selectedCaseId)?.isDeleted ? (
                <MenuItem onClick={() => handleRestoreCase(selectedCaseId)}>
                  <ListItemIcon>
                    <RestoreIcon fontSize="small" />
                  </ListItemIcon>
                  Restore
                </MenuItem>
              ) : (
                <MenuItem onClick={() => handleDeleteCase(selectedCaseId)}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              )}
              
              {cases.find(c => c.id === selectedCaseId)?.isDeleted && (
                <MenuItem 
                  onClick={() => handlePermanentlyDeleteCase(selectedCaseId)}
                  sx={{ color: 'error.main' }}
                >
                  <ListItemIcon sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  Permanently Delete
                </MenuItem>
              )}
            </>
          )}
        </Menu>
      </Box>
    </Container>
  );
}
